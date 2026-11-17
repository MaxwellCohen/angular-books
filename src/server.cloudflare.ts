import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { bindCatalogCache, htmlResponseWithCacheHeaders, type CatalogKv } from '@/lib/catalog-cache';
import { handleApi } from './server/api.server';

const angularAppEngine = new AngularAppEngine();

async function handle(request: Request): Promise<Response> {
  const apiResponse = await handleApi(request);
  if (apiResponse) return apiResponse;

  const result = await angularAppEngine.handle(request);
  return htmlResponseWithCacheHeaders(result || new Response('Not found', { status: 404 }));
}

export const reqHandler = createRequestHandler(handle);

export default {
  fetch(request: Request, env?: { CATALOG_CACHE?: CatalogKv }) {
    bindCatalogCache(env?.CATALOG_CACHE);
    return handle(request);
  },
};
