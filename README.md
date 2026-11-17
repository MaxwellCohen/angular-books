# Angular Books

Port of the Goodreads "Books" catalog demo to Angular 22 with SSR (`@angular/ssr`, `RenderMode.Server`), standalone components, signals, zoneless change detection, and Tailwind CSS v4.

- `/` catalog with search, filters, pagination, API-delay slider and theme toggle; all state lives in URL query params (`search, page, year, rating, pages, language, list, delay`).
- `/:id` book detail. Unknown ids and unknown routes return a real HTTP 404.
- `src/server.ts` (Express) exposes `/api/books`, `/api/books/count` and `/api/books/:id`, which run the Drizzle/Neon queries. Angular fetches them with `HttpClient`; SSR responses are passed to the browser via the HTTP transfer cache. DB code is only bundled into the server build.
- Without `POSTGRES_URL` the app serves a small generated preview catalog.

## Environment

Copy `.env.example` to `.env` (loaded by the server at startup):

- `POSTGRES_URL` - Neon/Postgres connection string (optional; preview catalog when empty)
- `API_DELAY_MS` - artificial API latency in ms (optional)

## Commands

```sh
pnpm install
pnpm dev        # ng serve
pnpm build
pnpm start      # production SSR server (PORT, default 4000)
pnpm typecheck
```

## Deployment

| Host | URL | Build flag |
| --- | --- | --- |
| Vercel | https://angular-books-sigma.vercel.app | `VERCEL=1` (set by Vercel) |
| Netlify | https://max-angular-books.netlify.app | `NETLIFY=1` |
| Cloudflare Workers | https://angular-books.to-email-max.workers.dev | `CLOUDFLARE=1` (or `WORKERS_CI`, set by Workers Builds) |

- Vercel and Netlify are connected to this repo: a push to `main` builds and deploys to both. Cloudflare is deployed with `pnpm deploy:cloudflare`.
- The build picks the host adapter from the flag above; with no flag it targets Node (Express).
- `POSTGRES_URL` is set on every host (Vercel and Netlify environment variable, Cloudflare secret). Without it the app serves the preview catalog.
- Manual deploys: `pnpm deploy:vercel`, `pnpm deploy:netlify`, `pnpm deploy:cloudflare`.

### Optimized branch

The `optimized` branch is deployed separately (production branch `optimized`):

| Host | URL |
| --- | --- |
| Vercel | https://angular-books-optimized.vercel.app |
| Netlify | https://angular-books-max-optimized.netlify.app |
| Cloudflare Workers | https://angular-books-optimized.to-email-max.workers.dev |

- Fonts: Geist and Geist Mono are self-hosted via `@fontsource-variable/*` and bundled with the app instead of loaded from Google Fonts.
- Caching: catalog queries are cached for 1 hour (in-memory with in-flight de-dup, plus Vercel runtime cache, Netlify Blobs or Cloudflare KV), and hashed JS/CSS/font assets are served with `Cache-Control: public, max-age=31536000, immutable`.
