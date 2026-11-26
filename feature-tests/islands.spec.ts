import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const STATIC_MARKER = 'FT_STATIC_ONLY_MARKER_B7E2';

test('static component ships no JS; interactive island hydrates on interaction', async ({ page }) => {
  const js: { url: string; body: string }[] = [];
  page.on('response', async (res) => {
    if (res.request().resourceType() === 'script' || res.url().endsWith('.js')) {
      js.push({ url: res.url(), body: await res.text().catch(() => '') });
    }
  });

  await page.goto('/feature-tests/islands');
  await page.waitForLoadState('networkidle');

  // Both components are server-rendered.
  await expect(page.locator('#ft-static')).toContainText(STATIC_MARKER);
  await expect(page.locator('#ft-island-count')).toHaveText('0');
  const islandLoadedBeforeInteraction = js.some((r) => r.body.includes('FT_ISLAND count'));

  // Interaction hydrates the island and replays the click.
  await page.click('#ft-island');
  await expect(page.locator('#ft-island-count')).toHaveText('1');
  await page.click('#ft-island');
  await expect(page.locator('#ft-island-count')).toHaveText('2');
  await page.waitForLoadState('networkidle');

  const islandChunk = js.find((r) => r.body.includes('FT_ISLAND count'));
  const leaked = js.filter((r) => r.body.includes(STATIC_MARKER)).map((r) => r.url);
  evidence(
    `${js.length} JS files downloaded, none contain the static marker (leaked: ${leaked.length}); island chunk ` +
      `${islandChunk?.url.split('/').pop()} loaded on interaction (before interaction: ${islandLoadedBeforeInteraction}); counter 0 -> 2 after clicks`,
  );
  expect(leaked).toEqual([]);
  expect(islandLoadedBeforeInteraction).toBe(false);
  expect(islandChunk).toBeTruthy();
});
