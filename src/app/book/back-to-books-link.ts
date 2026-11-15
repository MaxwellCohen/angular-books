import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CatalogParams } from '../core/catalog-params';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-back-to-books-link',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex' },
  template: `
    <a
      class="text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white"
      [routerLink]="['/']"
      [queryParams]="query()"
      (click)="back($event)"
    >
      <app-icon class="size-4" name="arrow-left" />
      Back to books
    </a>
  `,
})
export class BackToBooksLink {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly params = inject(CatalogParams);

  // The detail URL carries the catalog query string, so the link restores it.
  protected readonly query = this.params.committed;

  protected back(event: MouseEvent) {
    // Prefer real history (restores scroll) when we arrived from within the app.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (this.router.lastSuccessfulNavigation()?.previousNavigation) {
      event.preventDefault();
      this.location.back();
    }
  }
}
