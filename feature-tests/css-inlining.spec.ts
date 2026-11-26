import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { evidence } from './helpers';

test('critical CSS for the route is inlined and the stylesheet is non-blocking', async ({ request }) => {
  const html = await (await request.get('/feature-tests/css-inlining')).text();
  const head = html.slice(0, html.indexOf('</head>'));

  // The route-only rule exists in the external stylesheet...
  const browserDir = join(__dirname, '../dist/angular-books/browser');
  const cssFile = readdirSync(browserDir).find((f) => /^styles-.*\.css$/.test(f))!;
  expect(readFileSync(join(browserDir, cssFile), 'utf8')).toContain('#0a0b0c');

  // ...and is inlined into a <style> in the route's HTML.
  const inlineStyles = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const inlined = inlineStyles.find((css) => css.includes('.bg-\\[\\#0a0b0c\\]{background-color:#0a0b0c}'));
  expect(inlined, 'route rule inlined in <style>').toBeTruthy();

  // Rules for classes not on this page are not inlined (it's critical CSS, not the whole sheet).
  expect(inlineStyles.join('')).not.toContain('.animate-spin{');

  // No render-blocking stylesheet link outside <noscript>.
  const withoutNoscript = head.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  const links = [...withoutNoscript.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map((m) => m[0]);
  const blocking = links.filter((l) => !/media="print"/.test(l) && !/fonts\.googleapis/.test(l));
  evidence(`inline <style> contains .bg-[#0a0b0c] rule from ${cssFile}; stylesheet links: ${links.join(' ')}`);
  expect(blocking, 'render-blocking stylesheet links').toEqual([]);
});
