import { getBookById, getBooksCount, getBooksPage } from '@/features/book/book-queries.server';
import { toBookFilters, toBookQuery } from '@/features/book/book-utils';
import { waitForApiDelay } from '@/lib/api-delay';
import { getApiDelayMs, parseSearchParams } from '@/lib/url-state';
import type { RawSearchParams } from '@/lib/url-state';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env file (or no loadEnvFile on this runtime): rely on the process environment.
}

const json = (body: unknown, status = 200) => Response.json(body, { status });

/**
 * Framework-neutral implementation of the /api routes. Returns null when the
 * request is not an API request so the caller can fall through to Angular.
 */
export async function handleApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.pathname.startsWith('/api/books')) return null;

  const raw: RawSearchParams = {};
  for (const [key, value] of url.searchParams) raw[key] ??= value;
  const params = parseSearchParams(raw);

  try {
    await waitForApiDelay(getApiDelayMs(params));
    if (url.pathname === '/api/books') return json(await getBooksPage(toBookQuery(params)));
    if (url.pathname === '/api/books/count') {
      return json(await getBooksCount(toBookFilters(toBookQuery(params))));
    }
    const id = url.pathname.match(/^\/api\/books\/([^/]+)$/)?.[1];
    if (!id) return null;
    const book = await getBookById(decodeURIComponent(id));
    return book ? json(book) : json({ message: 'Book not found' }, 404);
  } catch (error) {
    console.error(error);
    return json({ message: error instanceof Error ? error.message : 'Internal error' }, 500);
  }
}
