import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BookGrid } from '../book/book-grid';
import { BookPagination } from '../book/book-pagination';
import { buttonClasses } from '../ui/button';
import { ErrorState } from '../ui/states';
import type { BookSummary } from '@/features/book/book-types';
import type { SearchParams } from '@/lib/url-state';

export type CatalogData = {
  params: SearchParams;
  books?: BookSummary[];
  total?: number;
  error?: string;
};

@Component({
  selector: 'app-home-page',
  imports: [BookGrid, BookPagination, ErrorState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    @if (data().error !== undefined) {
      <app-error-state body="{{ data().error }}" title="Can't load books">
        <button [class]="retryClass" type="button" (click)="reload()">Try again</button>
      </app-error-state>
    } @else {
      <div
        class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6"
      >
        <app-book-grid [books]="data().books ?? []" [searchParams]="data().params" />
      </div>
      <footer class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
        <app-book-pagination [searchParams]="data().params" [totalResults]="data().total ?? 0" />
      </footer>
    }
  `,
})
export class HomePage {
  readonly data = input.required<CatalogData>();
  protected readonly retryClass = buttonClasses({ class: 'mt-1', size: 'sm', variant: 'secondary' });

  constructor() {
    inject(Title).setTitle('Books · Angular Books');
  }

  protected reload() {
    location.reload();
  }
}
