import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'ft-counter-island',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button id="ft-island" type="button" class="mt-4 border px-3 py-1" (click)="count.update((n) => n + 1)">
      FT_ISLAND count: <span id="ft-island-count">{{ count() }}</span>
    </button>
  `,
})
export class CounterIsland {
  protected readonly count = signal(0);
}
