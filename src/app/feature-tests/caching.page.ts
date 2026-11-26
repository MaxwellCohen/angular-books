import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

type Stamp = { now: number; counter: number };

/**
 * /feature-tests/caching is RenderMode.Prerender: HttpClient fetches /api/ft/now at build
 * time and the HttpClient transfer cache (on by default with provideClientHydration)
 * embeds the response so hydration does not refetch it.
 */
@Component({
  selector: 'ft-caching-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Caching (prerender + HttpClient transfer cache)</h1>
      <p>Server stamp: <span id="ft-stamp">{{ stamp()?.now }}</span></p>
      <p>Server counter: <span id="ft-counter">{{ stamp()?.counter }}</span></p>
    </section>
  `,
})
export class CachingPage {
  protected readonly stamp = toSignal(inject(HttpClient).get<Stamp>('/api/ft/now'));
}

/** /feature-tests/caching/headers is RenderMode.Server with per-route Cache-Control `headers`. */
@Component({
  selector: 'ft-caching-headers-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Caching (per-route headers)</h1>
      <p>Server stamp: <span id="ft-stamp">{{ stamp()?.now }}</span></p>
    </section>
  `,
})
export class CachingHeadersPage {
  protected readonly stamp = toSignal(inject(HttpClient).get<Stamp>('/api/ft/now'));
}
