import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ft-route-prefetching-target-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<section class="p-6"><h1 id="ft-target" class="text-xl font-semibold">FT_ROUTE_TARGET_MARKER_9d41</h1></section>`,
})
export class RoutePrefetchingTargetPage {}
