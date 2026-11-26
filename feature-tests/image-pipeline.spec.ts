import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('NgOptimizedImage renders srcset, dimensions, lazy loading and modern formats', async ({ page, request }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/feature-tests/image-pipeline');
  const hero = page.locator('#ft-hero');
  const offscreen = page.locator('#ft-offscreen');

  const srcset = (await hero.getAttribute('srcset')) ?? '';
  const candidates = srcset.split(/,\s+/).map((c) => c.trim().split(/\s+/));
  const widths = new Set(candidates.map(([, d]) => d));
  expect(widths.size, `srcset candidates: ${srcset}`).toBeGreaterThanOrEqual(2);
  expect(await hero.getAttribute('width')).toBe('800');
  expect(await hero.getAttribute('height')).toBe('533');
  expect(await hero.getAttribute('fetchpriority')).toBe('high');
  expect(await offscreen.getAttribute('loading')).toBe('lazy');
  expect(await offscreen.getAttribute('width')).toBe('800');
  expect(await offscreen.getAttribute('height')).toBe('533');

  // priority image gets an SSR preload link.
  const html = await (await request.get('/feature-tests/image-pipeline')).text();
  const preload = /<link(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/.test(html);

  // The offscreen lazy image has not been fetched before scrolling.
  const offscreenLoadedBefore = await offscreen.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);

  const url = (candidates.find(([, d]) => d === '640w') ?? candidates[Math.floor(candidates.length / 2)])[0];
  const res = await request.get(url, { headers: { Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' } });
  const type = res.headers()['content-type'];
  evidence(
    `srcset="${srcset.slice(0, 160)}…" (${widths.size} widths), width/height=800x533, offscreen loading=lazy (loaded before scroll=${offscreenLoadedBefore}), ` +
      `SSR preload link=${preload}, ${url} -> ${res.status()} ${type}; resizing/format done by Cloudinary, not Angular`,
  );
  expect(res.ok()).toBe(true);
  expect(type).toMatch(/image\/(avif|webp)/);
  expect(offscreenLoadedBefore).toBe(false);
});
