import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Injectable, REQUEST, inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import type { BookDetails, BookSummary } from '@/features/book/book-types';
import type { SearchParams } from '@/lib/url-state';

export function cleanSearch(params: SearchParams): SearchParams {
  const next: SearchParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') next[key as keyof SearchParams] = value;
  }
  return next;
}

export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return (error.error as { message?: string } | null)?.message ?? error.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}

@Injectable({ providedIn: 'root' })
export class BooksApi {
  private readonly http = inject(HttpClient);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly document = inject(DOCUMENT);

  // Absolute on both sides so the SSR HttpClient transfer-cache keys match in the browser.
  private url(path: string): string {
    const origin = this.request ? new URL(this.request.url).origin : this.document.location.origin;
    return `${origin}${path}`;
  }

  private params(params: SearchParams): HttpParams {
    return new HttpParams({ fromObject: cleanSearch(params) as Record<string, string> });
  }

  books(params: SearchParams): Observable<BookSummary[]> {
    return this.http.get<BookSummary[]>(this.url('/api/books'), { params: this.params(params) });
  }

  count(params: SearchParams): Observable<number> {
    return this.http.get<number>(this.url('/api/books/count'), { params: this.params(params) });
  }

  book(id: string, delay?: string): Observable<BookDetails | null> {
    return this.http
      .get<BookDetails | null>(this.url(`/api/books/${encodeURIComponent(id)}`), {
        params: this.params({ delay }),
      })
      .pipe(
        catchError((error: unknown) =>
          error instanceof HttpErrorResponse && error.status === 404 ? of(null) : throwError(() => error),
        ),
      );
  }
}
