import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CatalogParams } from '../core/catalog-params';
import { Range } from '../ui/range';
import { API_DELAY_VALUES, formatApiDelay, getApiDelayMs } from '@/lib/url-state';

@Component({
  selector: 'app-api-delay',
  imports: [Range],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-filtering]': 'params.pending() ? "" : null' },
  template: `
    <app-range
      label="API delay"
      [id]="idPrefix() + '-api-delay'"
      [readout]="readout()"
      [value]="delay()"
      [values]="values"
      (valueChange)="commit($event)"
    >
      <span>Off</span>
      <span>3s</span>
    </app-range>
  `,
})
export class ApiDelay {
  protected readonly params = inject(CatalogParams);
  readonly idPrefix = input.required<string>();

  protected readonly values = API_DELAY_VALUES;
  protected readonly delay = computed(() => getApiDelayMs(this.params.current()));
  protected readonly readout = computed(() => formatApiDelay(this.delay()));

  protected commit(next: number) {
    this.params.replace({ ...this.params.current(), delay: next === 0 ? undefined : String(next) });
  }
}
