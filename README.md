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
