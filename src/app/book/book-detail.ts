import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../ui/icon';
import { StarRating } from '../ui/glyphs';
import { BookCover } from './book-cover';
import { formatCount, getLanguageLabel } from '@/features/book/book-utils';
import type { BookDetails } from '@/features/book/book-types';

@Component({
  selector: 'app-book-detail',
  imports: [BookCover, Icon, StarRating],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <article class="flex flex-col gap-8 md:flex-row md:gap-10">
      <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
        <app-book-cover
          class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
          [priority]="true"
          sizes="(min-width: 768px) 18rem, 60vw"
          [src]="book().image_url"
          [thumbhash]="book().thumbhash"
          [title]="book().title"
        />
      </div>

      <div class="min-w-0 flex-1">
        <h1>{{ book().title }}</h1>
        @if (book().authors.length > 0) {
          <p class="text-muted mt-2 text-base sm:text-lg">{{ book().authors.join(', ') }}</p>
        }

        @if (hasRating()) {
          <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <app-star-rating [rating]="rating()" />
            <span class="text-sm font-semibold tabular-nums">{{ rating().toFixed(1) }}</span>
            @if (book().ratings_count) {
              <span class="text-muted text-sm tabular-nums">{{ formatCount(book().ratings_count ?? 0) }} ratings</span>
            }
          </div>
        }

        @if (book().description) {
          <p class="text-muted mt-6 max-w-prose text-sm leading-7">{{ book().description }}</p>
        }

        <dl
          class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2"
        >
          <div class="flex items-start gap-3">
            <span class="text-muted mt-0.5 shrink-0"><app-icon class="size-4" name="book-open" /></span>
            <div class="min-w-0">
              <dt class="text-muted text-xs font-semibold tracking-wide uppercase">Pages</dt>
              <dd class="mt-0.5 truncate text-sm">
                {{ book().num_pages ? book().num_pages!.toLocaleString('en-US') : 'Unknown' }}
              </dd>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-muted mt-0.5 shrink-0"><app-icon class="size-4" name="globe" /></span>
            <div class="min-w-0">
              <dt class="text-muted text-xs font-semibold tracking-wide uppercase">Language</dt>
              <dd class="mt-0.5 truncate text-sm">{{ getLanguageLabel(book().language_code) }}</dd>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-muted mt-0.5 shrink-0"><app-icon class="size-4" name="calendar-days" /></span>
            <div class="min-w-0">
              <dt class="text-muted text-xs font-semibold tracking-wide uppercase">Published</dt>
              <dd class="mt-0.5 truncate text-sm">{{ book().publication_year ?? 'Unknown' }}</dd>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-muted mt-0.5 shrink-0"><app-icon class="size-4" name="building-2" /></span>
            <div class="min-w-0">
              <dt class="text-muted text-xs font-semibold tracking-wide uppercase">Publisher</dt>
              <dd class="mt-0.5 truncate text-sm">{{ book().publisher ?? 'Unknown' }}</dd>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-muted mt-0.5 shrink-0"><app-icon class="size-4" name="hash" /></span>
            <div class="min-w-0">
              <dt class="text-muted text-xs font-semibold tracking-wide uppercase">ISBN</dt>
              <dd class="mt-0.5 truncate text-sm">
                <span class="font-mono text-xs">{{ book().isbn ?? 'None' }}</span>
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </article>
  `,
})
export class BookDetail {
  readonly book = input.required<BookDetails>();

  protected readonly formatCount = formatCount;
  protected readonly getLanguageLabel = getLanguageLabel;
  protected readonly rating = computed(() => Number(this.book().average_rating));
  protected readonly hasRating = computed(() => this.book().average_rating !== null && !Number.isNaN(this.rating()));
}
