import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('font is self-hosted, uses font-display and is preloaded', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/font-optimization')).text();
  const head = html.slice(0, html.indexOf('</head>'));

  const inlinedFontCss = /<style[^>]*>[^<]*@font-face\{font-family:'Lobster'/.test(head);
  const fontDisplay = /@font-face\{[^}]*font-display:swap/.test(head);
  const preload = /<link[^>]*rel="preload"[^>]*as="font"/.test(head);
  const preconnect = /<link[^>]*rel="preconnect"[^>]*fonts\.gstatic\.com/.test(head);
  const googleCssLink = /<link[^>]*fonts\.googleapis\.com/.test(head);

  const fontRequests: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'font' || /fonts\.(googleapis|gstatic)\.com/.test(r.url())) fontRequests.push(r.url());
  });
  await page.goto('/feature-tests/font-optimization');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  const thirdPartyFontRequests = fontRequests.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u));

  evidence(
    `fonts.inline: Google CSS inlined=${inlinedFontCss}, <link> to googleapis left=${googleCssLink}, font-display:swap=${fontDisplay}, ` +
      `preload as=font=${preload}, preconnect gstatic=${preconnect}, font files from Google=${thirdPartyFontRequests.length} (${thirdPartyFontRequests[0] ?? 'none'})`,
  );

  expect.soft(inlinedFontCss, 'optimization.fonts.inline inlined the Google Fonts CSS').toBe(true);
  expect.soft(fontDisplay, '@font-face has font-display').toBe(true);
  expect.soft(thirdPartyFontRequests, 'self-hosted: no requests to fonts.googleapis.com / fonts.gstatic.com').toEqual([]);
  expect.soft(preload, '<link rel=preload as=font> present').toBe(true);
});
