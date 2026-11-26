import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HoverPrefetchTarget } from './hover-prefetch-target';

/**
 * Router: withPreloading(PreloadAllModules) (app.config.ts) preloads lazy route chunks
 * after navigation, before any click. @defer: `prefetch on hover` fetches the block's
 * chunk when the trigger is hovered.
 */
@Component({
  selector: 'ft-route-prefetching-page',
  imports: [RouterLink, HoverPrefetchTarget],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Route prefetching</h1>
      <p><a id="ft-target-link" class="underline" routerLink="/feature-tests/route-prefetching/target">Go to target route</a></p>
      <button id="ft-defer-trigger" type="button" class="mt-4 border px-3 py-1" #trigger>Hover me, then click</button>
      @defer (on interaction(trigger); prefetch on hover(trigger)) {
        <ft-hover-prefetch-target />
      }
    </section>
  `,
})
export class RoutePrefetchingPage {}
