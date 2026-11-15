import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cleanSearch } from '../core/books-api';
import { BookCover } from './book-cover';
import type { BookSummary } from '@/features/book/book-types';
import type { SearchParams } from '@/lib/url-state';

const GRID_SIZES =
  '(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw';

@Component({
  selector: 'app-book-card',
  imports: [RouterLink, BookCover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <a
      class="focus-visible:ring-action focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      [routerLink]="['/', book().id]"
      [queryParams]="query()"
    >
      <app-book-cover
        class="group-hover:shadow-soft transition-shadow"
        [priority]="priority()"
        [sizes]="sizes"
        [src]="book().image_url"
        [thumbhash]="book().thumbhash"
        [title]="book().title"
      />
      <span class="sr-only">{{ book().title }}</span>
    </a>
  `,
})
export class BookCard {
  readonly book = input.required<BookSummary>();
  readonly priority = input.required<boolean>();
  readonly searchParams = input.required<SearchParams>();

  protected readonly sizes = GRID_SIZES;
  protected readonly query = computed(() => cleanSearch(this.searchParams()));
}
