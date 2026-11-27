import { RESPONSE_INIT, inject } from '@angular/core';
import { Routes } from '@angular/router';
import type { ResolveFn } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { BooksApi, cleanSearch, errorMessage } from './core/books-api';
import type { BookData } from './pages/book.page';
import type { CatalogData } from './pages/home.page';
import { parseSearchParams } from '@/lib/url-state';
import type { RawSearchParams } from '@/lib/url-state';

const catalogResolver: ResolveFn<CatalogData> = (route) => {
  const api = inject(BooksApi);
  const params = cleanSearch(parseSearchParams(route.queryParams as RawSearchParams));
  return forkJoin({ books: api.books(params), total: api.count(params) }).pipe(
    map(({ books, total }): CatalogData => ({ params, books, total })),
    catchError((error: unknown) => of<CatalogData>({ params, error: errorMessage(error) })),
  );
};

const bookResolver: ResolveFn<BookData> = (route) => {
  const api = inject(BooksApi);
  const response = inject(RESPONSE_INIT, { optional: true });
  return api.book(route.paramMap.get('id') ?? '', route.queryParamMap.get('delay') ?? undefined).pipe(
    map((book): BookData => {
      if (!book && response) response.status = 404;
      return { book };
    }),
    catchError((error: unknown) => of<BookData>({ book: null, error: errorMessage(error) })),
  );
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: { data: catalogResolver },
  },
  {
    path: 'feature-tests',
    data: { preload: true },
    loadChildren: () => import('./feature-tests/feature-tests.routes').then((m) => m.featureTestRoutes),
  },
  {
    path: ':id',
    data: { preload: true },
    loadComponent: () => import('./pages/book.page').then((m) => m.BookPage),
    resolve: { data: bookResolver },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found.page').then((m) => m.NotFoundPage),
  },
];
