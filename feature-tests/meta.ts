/** Claimed labels (framework-compare capability.json, frameworkId "angular") and the approach used. */
export const FEATURES: Record<string, { claimedLabel: string; method: string; suggestedLabel?: string }> = {
  'css-inlining': {
    claimedLabel: 'first-party',
    method: 'optimization.styles.inlineCritical (default true in production): Beasties inlines the critical rules of the global stylesheet into the SSR HTML',
  },
  'font-optimization': {
    claimedLabel: 'first-party',
    method: 'optimization.fonts.inline (default true) inlines a Google Fonts <link> from index.feature-tests.html at build time',
    suggestedLabel: 'manual',
  },
  'image-pipeline': {
    claimedLabel: 'first-party',
    method: 'NgOptimizedImage (ngSrc, sizes, priority) with the built-in provideCloudinaryLoader (Cloudinary public demo cloud does the resizing/format)',
  },
  caching: {
    claimedLabel: 'first-party',
    method: 'RenderMode.Prerender + default HttpClient transfer cache (provideClientHydration) + per-route ServerRoute headers (Cache-Control s-maxage)',
  },
  'route-prefetching': {
    claimedLabel: 'first-party',
    method: 'provideRouter(..., withPreloading(PreloadAllModules)) for lazy routes + @defer (on interaction; prefetch on hover)',
  },
  islands: {
    claimedLabel: 'first-party',
    method: 'Incremental hydration: @defer (hydrate never) static card + @defer (hydrate on interaction) counter island, default-on with provideClientHydration()',
  },
  'render-modes': {
    claimedLabel: 'first-party',
    method: 'ServerRoute[] in app.routes.server.ts with RenderMode.Prerender / RenderMode.Server / RenderMode.Client on different routes',
  },
  reactivity: {
    claimedLabel: 'first-party',
    method: 'signal() read in an OnPush child template (zoneless default); render counters on parent and child templates + constructors',
  },
  'bundle-analysis': {
    claimedLabel: 'third-party',
    method: 'ng build --stats-json (first-party esbuild metafile) + esbuild-visualizer (third-party) to render report.html',
  },
  'third-party-scripts': {
    claimedLabel: 'manual',
    method: 'Hand-rolled: afterNextRender + requestIdleCallback injects an async <script src=/ft/third-party.js>',
  },
  'multi-host-deployment': {
    claimedLabel: 'manual',
    method: 'Hand-written SSR entries per host (server.ts Express/AngularNodeAppEngine, server.cloudflare.ts + server.netlify.ts AngularAppEngine) chosen by angular.json configurations',
  },
};
