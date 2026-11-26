import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const stampOf = (html: string) => html.match(/id="ft-stamp"[^>]*>(\d+)</)?.[1];

test('prerendered data is reused across requests and hydration; per-route Cache-Control headers', async ({ page, request }) => {
  // 1) RenderMode.Prerender: the server stamp (fetched via HttpClient at build) is identical across requests.
  const a = stampOf(await (await request.get('/feature-tests/caching')).text());
  await new Promise((r) => setTimeout(r, 1100));
  const b = stampOf(await (await request.get('/feature-tests/caching')).text());
  expect(a).toBeTruthy();
  expect(b).toBe(a);

  // The live API returns a fresh value every call (so the reuse above is caching, not a constant).
  const live1 = await (await request.get('/api/ft/now')).json();
  const live2 = await (await request.get('/api/ft/now')).json();
  expect(live2.counter).toBeGreaterThan(live1.counter);

  // 2) HttpClient transfer cache: hydration reuses the embedded response, no browser refetch.
  const apiCalls: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/api/ft/now')) apiCalls.push(r.url());
  });
  await page.goto('/feature-tests/caching');
  await page.waitForLoadState('networkidle');
  const shown = await page.locator('#ft-stamp').textContent();
  const transferState = await page.locator('script#ng-state').textContent();
  const cached = Object.values(JSON.parse(transferState ?? '{}') as Record<string, { u?: string; b?: { now?: number } }>).find(
    (e) => e.u === '/api/ft/now',
  );
  expect(String(cached?.b?.now), 'transfer cache entry for /api/ft/now holds the prerendered stamp').toBe(a);
  expect(apiCalls).toEqual([]);
  expect(shown).toBe(a);

  // 3) Per-route headers on a RenderMode.Server route.
  const r1 = await request.get('/feature-tests/caching/headers');
  const cc = r1.headers()['cache-control'];
  expect(cc).toContain('s-maxage=60');
  const s1 = stampOf(await r1.text());
  const s2 = stampOf(await (await request.get('/feature-tests/caching/headers')).text());

  evidence(
    `prerendered stamp ${a} == ${b} across requests (live API counter ${live1.counter}->${live2.counter}); ` +
      `hydration made ${apiCalls.length} /api/ft/now requests (ng-state transfer cache), shown=${shown}; ` +
      `server route Cache-Control="${cc}" but its stamp changes per request locally (${s1} vs ${s2}): no server/data cache or ISR, reuse only via a CDN honoring s-maxage`,
  );
});
