import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Feature tests: see feature-tests/README.md.
  { path: 'feature-tests/caching', renderMode: RenderMode.Prerender },
  {
    path: 'feature-tests/caching/headers',
    renderMode: RenderMode.Server,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
      'X-Route-Cache-Control': '1',
    },
  },
  { path: 'feature-tests/render-modes/prerendered', renderMode: RenderMode.Prerender },
  { path: 'feature-tests/render-modes/server', renderMode: RenderMode.Server },
  { path: 'feature-tests/render-modes/client', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
