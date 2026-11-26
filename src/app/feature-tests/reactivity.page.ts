import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

let parentConstructed = 0;
let parentTemplateRuns = 0;
let childConstructed = 0;
let childTemplateRuns = 0;

/** Reads the signal: its view is the one Angular refreshes when the signal changes. */
@Component({
  selector: 'ft-reactive-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Count: <span id="ft-count">{{ count() }}</span></p>
    <p data-runs>child template runs: <span id="ft-child-template-runs">{{ trackTemplate() }}</span></p>
    <button id="ft-increment" type="button" class="border px-3 py-1" (click)="count.update((n) => n + 1)">+1</button>
  `,
})
export class ReactiveText {
  protected readonly count = signal(0);
  constructor() {
    childConstructed++;
    exposeCounters();
    // Lets the test write the signal from outside Angular: no template event listener, so no
    // listener-driven markForCheck of ancestor views; only signal-driven refresh happens.
    if (typeof window !== 'undefined') {
      (window as unknown as { __ftSetCount: (n: number) => void }).__ftSetCount = (n) => this.count.set(n);
    }
  }
  protected trackTemplate() {
    childTemplateRuns++;
    exposeCounters();
    return childTemplateRuns;
  }
}

@Component({
  selector: 'ft-reactivity-page',
  imports: [ReactiveText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Reactivity (signals, zoneless)</h1>
      <p>parent template runs: <span id="ft-parent-template-runs">{{ trackTemplate() }}</span></p>
      <ft-reactive-text />
    </section>
  `,
})
export class ReactivityPage {
  constructor() {
    parentConstructed++;
    exposeCounters();
  }
  protected trackTemplate() {
    parentTemplateRuns++;
    exposeCounters();
    return parentTemplateRuns;
  }
}

function exposeCounters() {
  if (typeof window === 'undefined') return;
  (window as unknown as { __ftReactivity: unknown }).__ftReactivity = {
    parentConstructed,
    parentTemplateRuns,
    childConstructed,
    childTemplateRuns,
  };
}
