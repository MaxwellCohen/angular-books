# Feature tests

Validates the 11 Framework Compare performance labels for Angular against a production build.

```sh
pnpm install          # or: npx pnpm@10 install
pnpm test:features    # builds (production,node,featuretests), serves on PORT 4125, runs all specs
FT_PORT=4126 pnpm test:features caching   # another port / a subset of specs
```

`feature-tests/run.mjs` runs `ng build -c production,node,featuretests`, then Playwright
(`feature-tests/playwright.config.ts`) starts `node dist/angular-books/server/server.mjs` on the port,
uses the system Chrome (`/home/maxc/.local/bin/google-chrome`), and `results-reporter.ts` writes
`feature-tests/results.json`. The `featuretests` build configuration only swaps in
`src/index.feature-tests.html` (adds a Google Fonts link for the font test); the normal builds are unchanged.

Pages live under `/feature-tests` (`src/app/feature-tests/`); server render modes are in `src/app/app.routes.server.ts`.

| Spec | What it checks |
| --- | --- |
| css-inlining | Route-only Tailwind rule is inlined into a `<style>` by `inlineCritical`; global stylesheet link is `media="print"` (async), unused rules not inlined. |
| font-optimization | `optimization.fonts.inline` inlines Google Fonts CSS with `font-display`; asserts self-hosting (no gstatic requests) and `<link rel=preload as=font>` — both missing, so it fails. |
| image-pipeline | `NgOptimizedImage` + built-in Cloudinary loader: srcset ≥2 widths, width/height, offscreen `loading=lazy` not fetched, SSR preload for `priority`, srcset URL returns AVIF/WebP. |
| caching | Prerendered stamp identical across requests; HttpClient transfer cache (`ng-state`) means no API refetch on hydration; per-route `headers` give `s-maxage` on a Server route. |
| route-prefetching | `withPreloading(PreloadAllModules)` downloads the target route chunk before any click; `@defer (prefetch on hover)` downloads its chunk on hover, before click. |
| islands | `@defer (hydrate never)` static card: its marker string is in no downloaded JS; `@defer (hydrate on interaction)` counter hydrates and counts on click. |
| render-modes | Prerender (file in build output, stable stamp), Server (stamp changes per request), Client (CSR shell, renders in browser). |
| reactivity | Signal set from outside Angular: constructors run once, parent template not re-run; asserts the signal-reading component's template doesn't re-run either (it does: view-level granularity). |
| bundle-analysis | `ng build --stats-json` writes `browser-stats.json`; third-party `esbuild-visualizer` renders `report.html` (in `dist-ft/stats`). |
| third-party-scripts | Hand-rolled `afterNextRender` + `requestIdleCallback` injection: not in SSR HTML, async, request starts after DCL/FCP, global gets set. |
| multi-host-deployment | Builds `production,node`, `production,cloudflare`, `production,netlify` into `dist-ft/<target>` and checks each server entry. |
