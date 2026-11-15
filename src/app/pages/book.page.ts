import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackToBooksLink } from '../book/back-to-books-link';
import { BookDetail } from '../book/book-detail';
import { buttonClasses } from '../ui/button';
import { EmptyState, ErrorState } from '../ui/states';
import { RouterLink } from '@angular/router';
import type { BookDetails } from '@/features/book/book-types';

export type BookData = { book: BookDetails | null; error?: string };

@Component({
  selector: 'app-book-page',
  imports: [BackToBooksLink, BookDetail, EmptyState, ErrorState, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-1 flex-col px-4 py-5 sm:px-6' },
  template: `
    <app-back-to-books-link />
    @if (data().error !== undefined) {
      <app-error-state body="{{ data().error }}" title="Can't load this book">
        <button [class]="retryClass" type="button" (click)="reload()">Try again</button>
      </app-error-state>
    } @else if (data().book; as book) {
      <app-book-detail [book]="book" />
    } @else {
      <app-empty-state body="We couldn't find a book with that id." title="Book not found">
        <a [class]="homeClass" routerLink="/">Back to the shelf</a>
      </app-empty-state>
    }
  `,
})
export class BookPage {
  readonly data = input.required<BookData>();
  protected readonly retryClass = buttonClasses({ class: 'mt-1', size: 'sm', variant: 'secondary' });
  protected readonly homeClass = buttonClasses({ class: 'mt-1', variant: 'secondary' });

  constructor() {
    const title = inject(Title);
    effect(() => title.setTitle(`${this.data().book?.title ?? 'Book'} · Angular Books`));
  }

  protected reload() {
    location.reload();
  }
}
