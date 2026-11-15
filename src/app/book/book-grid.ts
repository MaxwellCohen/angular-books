import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmptyState } from '../ui/states';
import { BookCard } from './book-card';
import { PRIORITY_COVER_COUNT } from '@/features/book/book-constants';
import type { BookSummary } from '@/features/book/book-types';
import type { SearchParams } from '@/lib/url-state';

@Component({
  selector: 'app-book-grid',
  imports: [BookCard, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @if (books().length > 0) {
      <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        @for (book of books(); track book.id; let index = $index) {
          <app-book-card [book]="book" [priority]="index < priorityCount" [searchParams]="searchParams()" />
        }
      </div>
    } @else {
      <app-empty-state
        body="Nothing matched these filters. Try widening the year range or clearing the search."
        title="No books found"
      />
    }
  `,
})
export class BookGrid {
  readonly books = input.required<BookSummary[]>();
  readonly searchParams = input.required<SearchParams>();
  protected readonly priorityCount = PRIORITY_COVER_COUNT;
}
