import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { getBookById, getBooksCount, getBooksPage } from '@/features/book/book-queries.server';
import { toBookFilters, toBookQuery } from '@/features/book/book-utils';
import { htmlResponseWithCacheHeaders } from '@/lib/catalog-cache';
import { waitForApiDelay } from '@/lib/api-delay';
import { getApiDelayMs, parseSearchParams } from '@/lib/url-state';
import type { RawSearchParams } from '@/lib/url-state';
import type { Request, Response } from 'express';
import { handleApi } from './server/api.server';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env file: rely on the process environment.
}

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const searchParams = (req: Request) => parseSearchParams(req.query as RawSearchParams);

const handler =
  (work: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response) =>
    work(req, res).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Internal error' });
    });

app.get(
  '/api/books',
  handler(async (req, res) => {
    const params = searchParams(req);
    await waitForApiDelay(getApiDelayMs(params));
    res.json(await getBooksPage(toBookQuery(params)));
  }),
);

app.get(
  '/api/books/count',
  handler(async (req, res) => {
    const params = searchParams(req);
    await waitForApiDelay(getApiDelayMs(params));
    res.json(await getBooksCount(toBookFilters(toBookQuery(params))));
  }),
);

app.get(
  '/api/books/:id',
  handler(async (req, res) => {
    await waitForApiDelay(getApiDelayMs(searchParams(req)));
    const book = await getBookById(String(req.params['id']));
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json(book);
  }),
);

app.get(
  '/api/ft/now',
  handler(async (req, res) => {
    const response = await handleApi(new globalThis.Request(new URL(req.originalUrl, 'http://localhost')));
    res.set('Cache-Control', 'no-store').json(await response!.json());
  }),
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response
        ? writeResponseToNodeResponse(htmlResponseWithCacheHeaders(response), res)
        : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
