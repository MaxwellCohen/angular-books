import { HttpBackend, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import type { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FetchBackend } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { handleApi } from './api.server';

/**
 * Server-only HttpBackend: /api/* calls run in-process instead of the server
 * fetching itself (which fails or loops on edge/worker hosts). Sits below the
 * transfer-cache interceptor, so cache keys stay identical for the browser.
 */
@Injectable()
export class ServerApiBackend implements HttpBackend {
  private readonly fetchBackend = inject(FetchBackend);

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    const url = new URL(req.urlWithParams);
    if (!url.pathname.startsWith('/api/')) return this.fetchBackend.handle(req);
    return from(this.run(req, url));
  }

  private async run(req: HttpRequest<unknown>, url: URL): Promise<HttpEvent<unknown>> {
    const response = await handleApi(new Request(url, { method: 'GET' }));
    if (!response) throw new HttpErrorResponse({ status: 404, url: req.urlWithParams });
    const body: unknown = await response.json();
    if (!response.ok) {
      throw new HttpErrorResponse({
        error: body,
        status: response.status,
        statusText: response.statusText,
        url: req.urlWithParams,
      });
    }
    return new HttpResponse({ body, status: response.status, url: req.urlWithParams });
  }
}
