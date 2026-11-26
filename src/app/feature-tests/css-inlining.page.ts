import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Uses a Tailwind arbitrary-value class that only this route renders. Tailwind
 * emits it into the global stylesheet; Angular's `optimization.styles.inlineCritical`
 * (default on in production) inlines the rules the SSR HTML uses into a <style> tag
 * and loads the stylesheet asynchronously.
 */
@Component({
  selector: 'ft-css-inlining-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">CSS inlining</h1>
      <p id="ft-css-marker" class="mt-4 bg-[#0a0b0c] p-4 text-[#fefdfc]">
        Styled by a route-only class (bg-[#0a0b0c]) that inlineCritical inlines.
      </p>
    </section>
  `,
})
export class CssInliningPage {}
