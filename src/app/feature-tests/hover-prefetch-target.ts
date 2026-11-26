import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ft-hover-prefetch-target',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p id="ft-deferred">FT_DEFER_HOVER_MARKER_51c2 loaded</p>`,
})
export class HoverPrefetchTarget {}
