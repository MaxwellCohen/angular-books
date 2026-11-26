import { ChangeDetectionStrategy, Component, afterNextRender } from '@angular/core';

/** Manual: inject the script after the first browser render, when the main thread is idle. */
@Component({
  selector: 'ft-third-party-scripts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Third-party scripts</h1>
      <p>A stand-in third-party script is injected after first render on idle.</p>
    </section>
  `,
})
export class ThirdPartyScriptsPage {
  constructor() {
    afterNextRender(() => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
      idle(() => {
        if (document.querySelector('script[data-ft-third-party]')) return;
        const s = document.createElement('script');
        s.src = '/ft/third-party.js';
        s.async = true;
        s.dataset['ftThirdParty'] = '';
        document.body.append(s);
      });
    });
  }
}
