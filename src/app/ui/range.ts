import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Native range input that steps through a fixed list of values. */
@Component({
  selector: 'app-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-2' },
  template: `
    <div class="flex items-baseline justify-between gap-2">
      <label class="text-muted text-xs font-semibold tracking-wide uppercase" [attr.for]="id()">
        {{ label() }}
      </label>
      <span class="text-sm font-medium text-black tabular-nums dark:text-white">{{ readout() }}</span>
    </div>
    <input
      class="focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
      [id]="id()"
      min="0"
      [max]="values().length - 1"
      step="1"
      type="range"
      [value]="index()"
      (input)="valueChange.emit(pick($event))"
    />
    <div class="text-muted flex justify-between text-[11px] tabular-nums">
      <ng-content />
    </div>
  `,
})
export class Range {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly readout = input.required<string | number>();
  readonly value = input.required<number>();
  readonly values = input.required<readonly number[]>();
  readonly valueChange = output<number>();

  protected readonly index = computed(() => {
    const values = this.values();
    const value = this.value();
    const exact = values.indexOf(value);
    if (exact >= 0) return exact;
    let closest = 0;
    let distance = Number.POSITIVE_INFINITY;
    values.forEach((candidate, i) => {
      const next = Math.abs(candidate - value);
      if (next < distance) {
        closest = i;
        distance = next;
      }
    });
    return closest;
  });

  protected pick(event: Event): number {
    const input = event.target as HTMLInputElement;
    return this.values()[Number(input.value)] ?? this.value();
  }
}
