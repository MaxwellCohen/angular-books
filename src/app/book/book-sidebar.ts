import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogParams } from '../core/catalog-params';
import { BookMark, GitHubIcon } from '../ui/glyphs';
import { ThemeToggle } from '../ui/theme-toggle';
import { ApiDelay } from './api-delay';
import { BookFilters } from './book-filters';
import { CatalogSize } from './catalog-size';

@Component({
  selector: 'app-book-sidebar',
  imports: [RouterLink, BookMark, GitHubIcon, ThemeToggle, ApiDelay, BookFilters, CatalogSize],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <div class="flex items-center justify-between gap-2">
      <a
        aria-label="Angular Books home"
        class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
        [routerLink]="['/']"
        [queryParams]="homeQuery()"
      >
        <app-book-mark class="text-action size-5" />
        Angular Books
      </a>
    </div>
    <div class="border-divider dark:border-divider-dark mt-6 border-b pb-5">
      <app-catalog-size />
    </div>
    <div class="mt-5 mb-4">
      <app-api-delay [idPrefix]="idPrefix()" />
    </div>
    <p class="text-muted mb-4 text-xs font-semibold tracking-wide uppercase">Filters</p>
    <app-book-filters [idPrefix]="idPrefix()" />
    @if (!mobile()) {
      <div
        class="border-divider dark:border-divider-dark mt-4 flex items-center justify-between gap-2 border-t pt-4"
      >
        <app-theme-toggle variant="inline" />
        <a
          aria-label="View source on GitHub"
          class="text-muted rounded-full p-1.5 transition-colors hover:text-black dark:hover:text-white"
          href="https://github.com/MaxwellCohen/angular-books"
          rel="noopener noreferrer"
          target="_blank"
        >
          <app-github-icon class="size-4" />
        </a>
      </div>
    }
  `,
})
export class BookSidebar {
  private readonly params = inject(CatalogParams);
  readonly idPrefix = input.required<string>();
  readonly mobile = input(false);

  protected readonly homeQuery = computed(() => {
    const { delay } = this.params.current();
    return delay ? { delay } : {};
  });
}
