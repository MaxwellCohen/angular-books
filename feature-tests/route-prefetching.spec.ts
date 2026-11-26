import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('lazy route chunk and @defer chunk are fetched before the click', async ({ page }) => {
  const events: { t: number; kind: string; url: string }[] = [];
  const t0 = Date.now();
  const markerChunks = new Map<string, string[]>();
  page.on('response', async (res) => {
    if (!res.url().endsWith('.js')) return;
    const body = await res.text().catch(() => '');
    for (const marker of ['FT_ROUTE_TARGET_MARKER_9d41', 'FT_DEFER_HOVER_MARKER_51c2']) {
      if (body.includes(marker)) {
        events.push({ t: Date.now() - t0, kind: marker, url: res.url() });
        markerChunks.set(marker, [...(markerChunks.get(marker) ?? []), res.url()]);
      }
    }
  });

  await page.goto('/feature-tests/route-prefetching');
  await page.waitForLoadState('networkidle');

  // PreloadAllModules: the target route's chunk is already downloaded, no click yet.
  await expect.poll(() => markerChunks.has('FT_ROUTE_TARGET_MARKER_9d41')).toBe(true);
  const routeChunkBeforeClick = markerChunks.get('FT_ROUTE_TARGET_MARKER_9d41')!;
  const deferBeforeHover = markerChunks.has('FT_DEFER_HOVER_MARKER_51c2');

  // @defer prefetch on hover: hovering fetches the deferred chunk before the click.
  await page.hover('#ft-defer-trigger');
  await expect.poll(() => markerChunks.has('FT_DEFER_HOVER_MARKER_51c2')).toBe(true);
  await expect(page.locator('#ft-deferred')).toHaveCount(0);
  await page.click('#ft-defer-trigger');
  await expect(page.locator('#ft-deferred')).toBeVisible();

  // Clicking the link renders the target without fetching its chunk again.
  const jsAfterClick: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.js')) jsAfterClick.push(r.url());
  });
  await page.click('#ft-target-link');
  await expect(page.locator('#ft-target')).toBeVisible();

  expect(deferBeforeHover).toBe(false);
  expect(jsAfterClick.filter((u) => routeChunkBeforeClick.includes(u))).toEqual([]);
  evidence(
    `PreloadAllModules fetched target route chunk ${routeChunkBeforeClick.map((u) => u.split('/').pop())} on page load before any click/hover (eager, not hover/viewport-driven); ` +
      `@defer prefetch on hover fetched its chunk on hover (not before); link click fetched ${jsAfterClick.length} JS files`,
  );
});
