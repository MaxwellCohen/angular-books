import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('third-party script is injected after first render and eventually runs', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text();
  const head = html.slice(0, html.indexOf('</head>'));
  expect(html).not.toContain('/ft/third-party.js');
  expect(head).not.toMatch(/<script(?![^>]*(async|defer|type="module"))[^>]*src=/);

  await page.goto('/feature-tests/third-party-scripts');
  await page.waitForFunction(() => (window as unknown as { __ftThirdParty?: unknown }).__ftThirdParty);
  const info = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
    const res = performance.getEntriesByType('resource').find((e) => e.name.endsWith('/ft/third-party.js')) as PerformanceResourceTiming | undefined;
    const el = document.querySelector('script[data-ft-third-party]') as HTMLScriptElement | null;
    const dcl = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).domContentLoadedEventEnd;
    return { fcp, start: res?.startTime ?? null, async: el?.async ?? null, inBody: el?.parentElement === document.body, dcl };
  });
  evidence(
    `not in SSR HTML; injected into <body> async=${info.async}; request started at ${info.start?.toFixed(0)}ms vs FCP ${info.fcp?.toFixed(0)}ms / DCL ${info.dcl.toFixed(0)}ms; window.__ftThirdParty set`,
  );
  expect(info.async).toBe(true);
  expect(info.start).not.toBeNull();
  expect(info.start!).toBeGreaterThan(info.dcl);
  if (info.fcp !== null) expect(info.start!).toBeGreaterThanOrEqual(info.fcp);
});
