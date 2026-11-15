import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalog-size',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p class="text-2xl font-semibold tracking-tight tabular-nums">2M+</p>
      <p class="text-muted mt-1 text-xs leading-5">books from Goodreads. Built on Angular SSR.</p>
    </div>
  `,
})
export class CatalogSize {}
