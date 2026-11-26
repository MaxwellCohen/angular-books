import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ft-static-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div id="ft-static" class="mt-4 border p-4">{{ marker }}</div>`,
})
export class StaticCard {
  // Unique string: must not appear in any JS the browser downloads.
  protected readonly marker = 'FT_STATIC_ONLY_MARKER_B7E2 (static card, never hydrated)';
}
