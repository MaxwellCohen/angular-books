import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'ft-render-modes-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Render modes (ServerRoute[] in app.routes.server.ts)</h1>
      <ul class="mt-4 list-disc pl-6">
        <li><a class="underline" routerLink="prerendered">RenderMode.Prerender</a></li>
        <li><a class="underline" routerLink="server">RenderMode.Server</a></li>
        <li><a class="underline" routerLink="client">RenderMode.Client</a></li>
      </ul>
    </section>
  `,
})
export class RenderModesPage {}

@Component({
  selector: 'ft-render-mode-probe-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Render mode: {{ mode }}</h1>
      <p>Rendered at: <span id="ft-rendered-at">{{ renderedAt }}</span></p>
      <p>Rendered on: <span id="ft-rendered-on">{{ renderedOn }}</span></p>
    </section>
  `,
})
export class RenderModeProbePage {
  protected readonly mode = inject(ActivatedRoute).snapshot.data['mode'] as string;
  protected readonly renderedAt = new Date().toISOString();
  protected readonly renderedOn = isPlatformServer(inject(PLATFORM_ID)) ? 'server' : 'browser';
}
