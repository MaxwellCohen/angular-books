import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../ui/icon';
import { cleanSearch } from '../core/books-api';
import { getCurrentPage, getTotalPages, withPage } from '@/lib/url-state';
import type { SearchParams } from '@/lib/url-state';

@Component({
  selector: 'app-book-pagination',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <nav aria-label="Pagination" class="flex items-center justify-between gap-4">
      @if (currentPage() > 1) {
        <a aria-label="Previous page" [class]="stepClass" [routerLink]="['/']" [queryParams]="prevQuery()">
          <app-icon class="size-4" name="chevron-left" />
          Previous
        </a>
      } @else {
        <span aria-disabled="true" [class]="stepClass + ' pointer-events-none opacity-40'">
          <app-icon class="size-4" name="chevron-left" />
          Previous
        </span>
      }

      <p class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm">
        <span class="hidden sm:inline">
          <span class="font-medium text-black dark:text-white">{{ totalResults().toLocaleString('en-US') }}</span>
          books
        </span>
        <span aria-hidden="true" class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block"></span>
        <span>Page {{ currentPage().toLocaleString('en-US') }} of {{ totalPages().toLocaleString('en-US') }}</span>
      </p>

      @if (currentPage() < totalPages()) {
        <a aria-label="Next page" [class]="stepClass" [routerLink]="['/']" [queryParams]="nextQuery()">
          Next
          <app-icon class="size-4" name="chevron-right" />
        </a>
      } @else {
        <span aria-disabled="true" [class]="stepClass + ' pointer-events-none opacity-40'">
          Next
          <app-icon class="size-4" name="chevron-right" />
        </span>
      }
    </nav>
  `,
})
export class BookPagination {
  readonly searchParams = input.required<SearchParams>();
  readonly totalResults = input.required<number>();

  protected readonly stepClass =
    'text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white';

  protected readonly totalPages = computed(() => getTotalPages(this.totalResults()));
  protected readonly currentPage = computed(() => getCurrentPage(this.searchParams(), this.totalPages()));
  protected readonly prevQuery = computed(() => cleanSearch(withPage(this.searchParams(), this.currentPage() - 1)));
  protected readonly nextQuery = computed(() => cleanSearch(withPage(this.searchParams(), this.currentPage() + 1)));
}
