import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CatalogParams } from '../core/catalog-params';
import { Icon } from '../ui/icon';
import { Range } from '../ui/range';
import { buttonClasses } from '../ui/button';
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from '@/features/book/book-constants';
import { withFilters } from '@/lib/url-state';
import type { SearchParams } from '@/lib/url-state';

@Component({
  selector: 'app-book-filters',
  imports: [Icon, Range],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
    '[attr.data-filtering]': 'params.pending() ? "" : null',
  },
  template: `
    <div
      class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6"
    >
      <div class="flex flex-col gap-6">
        <app-range
          label="Published before"
          [id]="idPrefix() + '-filter-year'"
          [readout]="filters().year ? filters().year! : 'Any year'"
          [value]="+(filters().year ?? maxYear)"
          [values]="yearValues"
          (valueChange)="commit({ year: $event === maxYear ? undefined : '' + $event })"
        >
          <span>{{ minYear }}</span>
          <span>{{ maxYear }}</span>
        </app-range>

        <app-range
          label="Minimum rating"
          [id]="idPrefix() + '-filter-rating'"
          [readout]="filters().rating ? filters().rating + '+' : 'Any rating'"
          [value]="+(filters().rating ?? minRating)"
          [values]="ratingValues"
          (valueChange)="commit({ rating: $event === minRating ? undefined : '' + $event })"
        >
          <span>Any</span>
          <span>{{ maxRating }} stars</span>
        </app-range>

        <app-range
          label="Max pages"
          [id]="idPrefix() + '-filter-pages'"
          [readout]="filters().pages ?? 'Any length'"
          [value]="+(filters().pages ?? maxPages)"
          [values]="pageValues"
          (valueChange)="commit({ pages: $event === maxPages ? undefined : '' + $event })"
        >
          <span>{{ minPages }}</span>
          <span>{{ maxPages }}</span>
        </app-range>

        <div class="flex flex-col gap-2">
          <label
            class="text-muted text-xs font-semibold tracking-wide uppercase"
            [attr.for]="idPrefix() + '-filter-language'"
          >
            Language
          </label>
          <span class="relative block min-w-0">
            <select
              class="border-divider focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full appearance-none rounded-md border bg-white px-3 py-2 pr-8 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white"
              [id]="idPrefix() + '-filter-language'"
              (change)="commit({ language: $any($event.target).value })"
            >
              @for (language of languages; track language.value) {
                <option [value]="language.value" [selected]="language.value === (filters().language ?? 'en')">
                  {{ language.label }}
                </option>
              }
            </select>
            <app-icon
              class="text-muted pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2"
              name="chevron-down"
            />
          </span>
        </div>

        <fieldset class="flex flex-col gap-2">
          <legend class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">Book lists</legend>
          @for (list of lists; track list.slug) {
            <label
              class="hover:bg-card dark:hover:bg-card-dark -mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
            >
              <input
                class="accent-action size-4 w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                type="checkbox"
                [checked]="filters().list === list.slug"
                (change)="commit({ list: filters().list === list.slug ? undefined : list.slug })"
              />
              {{ list.name }}
            </label>
          }
        </fieldset>
      </div>
    </div>

    @if (activeCount() > 0) {
      <div class="border-divider dark:border-divider-dark border-t pt-3">
        <button [class]="clearClass" type="button" (click)="clearAll()">Clear all filters</button>
      </div>
    }
  `,
})
export class BookFilters {
  protected readonly params = inject(CatalogParams);
  readonly idPrefix = input.required<string>();

  protected readonly filters = this.params.current;
  protected readonly activeCount = computed(
    () =>
      Object.entries(this.filters()).filter(([key, value]) => key !== 'page' && key !== 'delay' && Boolean(value))
        .length,
  );

  protected readonly languages = LANGUAGES;
  protected readonly lists = LISTS;
  protected readonly yearValues = YEAR_FILTER_VALUES;
  protected readonly ratingValues = RATING_FILTER_VALUES;
  protected readonly pageValues = PAGE_FILTER_VALUES;
  protected readonly minYear = MIN_YEAR;
  protected readonly maxYear = MAX_YEAR;
  protected readonly minRating = MIN_RATING;
  protected readonly maxRating = MAX_RATING;
  protected readonly minPages = MIN_PAGES;
  protected readonly maxPages = MAX_PAGES;
  protected readonly clearClass = buttonClasses({ class: 'w-full', variant: 'secondary' });

  protected commit(patch: Partial<SearchParams>) {
    this.params.replace(withFilters(this.filters(), patch));
  }

  protected clearAll() {
    const { delay } = this.filters();
    this.params.replace(delay ? { delay } : {});
  }
}
