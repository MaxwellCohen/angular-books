import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Preloads only routes marked `data: { preload: true }`, so the feature test can
 * show router preloading without changing how the book pages load.
 */
@Injectable({ providedIn: 'root' })
export class FlaggedPreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : of(null);
  }
}
