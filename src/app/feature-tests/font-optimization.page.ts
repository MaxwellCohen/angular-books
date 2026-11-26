import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * First-party: `optimization.fonts.inline` inlines the Google Fonts stylesheet linked
 * from src/index.feature-tests.html (the `featuretests` build configuration) into the HTML.
 */
@Component({
  selector: 'ft-font-optimization-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Font optimization</h1>
      <p id="ft-font-sample" style="font-family: 'Lobster', cursive; font-size: 2rem">
        The quick brown fox jumps over the lazy dog.
      </p>
    </section>
  `,
})
export class FontOptimizationPage {}
