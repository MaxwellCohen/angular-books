import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter } from 'rxjs';
import { cleanSearch } from './books-api';
import { parseSearchParams } from '@/lib/url-state';
import type { RawSearchParams, SearchParams } from '@/lib/url-state';

/** URL query params are the single source of truth for catalog state. */
@Injectable({ providedIn: 'root' })
export class CatalogParams {
  private readonly router = inject(Router);
  private readonly url = signal(this.router.url);
  private readonly optimistic = signal<SearchParams | null>(null);

  /** Committed URL state. */
  readonly committed = computed(() =>
    cleanSearch(parseSearchParams(this.router.parseUrl(this.url()).queryParams as RawSearchParams)),
  );
  /** URL state, or the requested state while a navigation is in flight. */
  readonly current = computed(() => this.optimistic() ?? this.committed());
  readonly pending = computed(() => this.router.currentNavigation() !== null);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationError))
      .subscribe(() => {
        this.url.set(this.router.url);
        this.optimistic.set(null);
      });
  }

  replace(next: SearchParams) {
    const params = cleanSearch(next);
    this.optimistic.set(params);
    void this.router.navigate(['/'], { queryParams: params, replaceUrl: true });
  }
}
