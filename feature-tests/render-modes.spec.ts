import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { evidence } from './helpers';

const stampOf = (html: string) => html.match(/id="ft-rendered-at"[^>]*>([^<]+)</)?.[1];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test('Prerender, Server and Client render modes on different routes', async ({ page, request }) => {
  const prerenderFile = join(__dirname, '../dist/angular-books/browser/feature-tests/render-modes/prerendered/index.html');
  expect(existsSync(prerenderFile), 'prerendered HTML in build output').toBe(true);

  const p1 = stampOf(await (await request.get('/feature-tests/render-modes/prerendered')).text());
  await sleep(1100);
  const p2 = stampOf(await (await request.get('/feature-tests/render-modes/prerendered')).text());
  expect(p1).toBeTruthy();
  expect(p2).toBe(p1);

  const s1 = stampOf(await (await request.get('/feature-tests/render-modes/server')).text());
  await sleep(50);
  const s2 = stampOf(await (await request.get('/feature-tests/render-modes/server')).text());
  expect(s1).toBeTruthy();
  expect(s2).not.toBe(s1);
  expect(existsSync(join(__dirname, '../dist/angular-books/browser/feature-tests/render-modes/server/index.html'))).toBe(false);

  const clientHtml = await (await request.get('/feature-tests/render-modes/client')).text();
  const clientSsr = stampOf(clientHtml);
  expect(clientSsr, 'client route HTML has no server-rendered content').toBeUndefined();
  await page.goto('/feature-tests/render-modes/client');
  await expect(page.locator('#ft-rendered-on')).toHaveText('browser');

  evidence(
    `prerendered: build file exists, stamp stable ${p1} == ${p2}; server: stamp changes ${s1} -> ${s2}; ` +
      `client: response is the CSR shell (no stamp), rendered in browser`,
  );
});
