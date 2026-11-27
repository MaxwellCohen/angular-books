import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preloads only routes marked `data: { preload: true }`: the book-detail page
 * (so opening a book from the catalog doesn't wait on its chunk) and the
 * feature-test routes, but not the rest of the feature-test pages.
 */
@Injectable({ providedIn: 'root' })
export class FlaggedPreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
