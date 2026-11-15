import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import type { ElementRef } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CatalogParams } from '../core/catalog-params';
import { Icon } from '../ui/icon';
import { Spinner } from '../ui/glyphs';
import { withFilters } from '@/lib/url-state';

const DEBOUNCE_MS = 220;

@Component({
  selector: 'app-book-search',
  imports: [Icon, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-1' },
  template: `
    <form
      class="relative flex-1"
      role="search"
      [attr.aria-busy]="params.pending()"
      [attr.data-filtering]="params.pending() ? '' : null"
      (submit)="submit($event)"
    >
      <label class="sr-only" for="book-search">Search books</label>
      <span
        aria-hidden="true"
        class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
      >
        @if (params.pending()) {
          <app-spinner class="size-4" />
        } @else {
          <app-icon class="size-4" name="search" />
        }
      </span>
      <input
        #input
        class="border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark peer h-11 w-full rounded-lg border bg-white py-2 pr-10 pl-10 text-base text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm dark:bg-[#1c1c1c] dark:text-white"
        id="book-search"
        name="search"
        placeholder="Search books…"
        type="search"
        [attr.value]="params.committed().search ?? ''"
        (input)="onInput($any($event.target).value)"
      />
      <button
        aria-label="Clear search"
        class="text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark absolute top-1/2 right-1.5 inline-flex size-8 shrink-0 -translate-y-1/2 items-center justify-center rounded-md transition-colors peer-placeholder-shown:hidden hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
        type="button"
        (click)="clear()"
      >
        <app-icon class="size-4" name="x" />
      </button>
    </form>
  `,
})
export class BookSearch {
  protected readonly params = inject(CatalogParams);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    // Keep the field in sync with the URL (back/forward, clear all) unless the user is typing.
    effect(() => {
      const search = this.params.committed().search ?? '';
      const el = this.input().nativeElement;
      if (this.browser && this.document.activeElement !== el) el.value = search;
    });
  }

  protected onInput(value: string) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.navigate(value), DEBOUNCE_MS);
  }

  protected submit(event: Event) {
    event.preventDefault();
    clearTimeout(this.timer);
    this.navigate(this.input().nativeElement.value);
  }

  protected clear() {
    clearTimeout(this.timer);
    const el = this.input().nativeElement;
    el.value = '';
    this.navigate('');
    el.focus();
  }

  private navigate(value: string) {
    const query = value.trim();
    this.params.replace(withFilters(this.params.current(), { search: query || undefined }));
  }
}
