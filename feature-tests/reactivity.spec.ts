import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

type Counters = { parentConstructed: number; parentTemplateRuns: number; childConstructed: number; childTemplateRuns: number };

test('signal update changes bound text without re-running the component', async ({ page }) => {
  await page.goto('/feature-tests/reactivity');
  await page.waitForLoadState('networkidle');
  const read = () => page.evaluate(() => (window as unknown as { __ftReactivity: Counters }).__ftReactivity);
  const before = await read();

  // (a) Signal written from outside Angular (no template event): isolates signal-driven updates.
  for (let i = 1; i <= 3; i++) {
    await page.evaluate((n) => (window as unknown as { __ftSetCount: (n: number) => void }).__ftSetCount(n), i);
    await expect(page.locator('#ft-count')).toHaveText(String(i));
  }
  const after = await read();

  // (b) Template (click) handler: Angular also marks ancestor views dirty for the event.
  await page.click('#ft-increment');
  await expect(page.locator('#ft-count')).toHaveText('4');
  const afterClick = await read();

  evidence(
    `count 0->3; constructors parent ${before.parentConstructed}->${after.parentConstructed}, child ${before.childConstructed}->${after.childConstructed}; ` +
      `3 signal.set() calls from outside Angular: parent template runs ${before.parentTemplateRuns}->${after.parentTemplateRuns}, child (signal-reading) template runs ${before.childTemplateRuns}->${after.childTemplateRuns}; ` +
      `1 (click) handler: parent ${after.parentTemplateRuns}->${afterClick.parentTemplateRuns}, child ${after.childTemplateRuns}->${afterClick.childTemplateRuns}. ` +
      `Granularity is the component view (its whole template update pass re-runs), not the text node`,
  );

  // Components are never re-created, and the parent view is not refreshed.
  expect(after.parentConstructed).toBe(1);
  expect(after.childConstructed).toBe(1);
  expect(after.parentTemplateRuns).toBe(before.parentTemplateRuns);
  // Strict fine-grained check: the template function of the component that reads the signal
  // must not re-run either (render counter stays put).
  expect(after.childTemplateRuns, 'signal-reading component template re-ran').toBe(before.childTemplateRuns);
});
