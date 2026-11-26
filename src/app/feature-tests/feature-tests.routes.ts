import { Routes } from '@angular/router';

export const FEATURE_IDS = [
  'css-inlining',
  'font-optimization',
  'image-pipeline',
  'caching',
  'route-prefetching',
  'islands',
  'render-modes',
  'reactivity',
  'bundle-analysis',
  'third-party-scripts',
  'multi-host-deployment',
] as const;

export const featureTestRoutes: Routes = [
  { path: '', loadComponent: () => import('./index.page').then((m) => m.FeatureTestsIndexPage) },
  { path: 'css-inlining', loadComponent: () => import('./css-inlining.page').then((m) => m.CssInliningPage) },
  { path: 'font-optimization', loadComponent: () => import('./font-optimization.page').then((m) => m.FontOptimizationPage) },
  { path: 'image-pipeline', loadComponent: () => import('./image-pipeline.page').then((m) => m.ImagePipelinePage) },
  { path: 'caching', loadComponent: () => import('./caching.page').then((m) => m.CachingPage) },
  { path: 'caching/headers', loadComponent: () => import('./caching.page').then((m) => m.CachingHeadersPage) },
  { path: 'route-prefetching', loadComponent: () => import('./route-prefetching.page').then((m) => m.RoutePrefetchingPage) },
  {
    path: 'route-prefetching/target',
    data: { preload: true },
    loadComponent: () => import('./route-prefetching-target.page').then((m) => m.RoutePrefetchingTargetPage),
  },
  { path: 'islands', loadComponent: () => import('./islands.page').then((m) => m.IslandsPage) },
  { path: 'render-modes', loadComponent: () => import('./render-modes.page').then((m) => m.RenderModesPage) },
  { path: 'render-modes/prerendered', loadComponent: () => import('./render-modes.page').then((m) => m.RenderModeProbePage), data: { mode: 'prerender' } },
  { path: 'render-modes/server', loadComponent: () => import('./render-modes.page').then((m) => m.RenderModeProbePage), data: { mode: 'server' } },
  { path: 'render-modes/client', loadComponent: () => import('./render-modes.page').then((m) => m.RenderModeProbePage), data: { mode: 'client' } },
  { path: 'reactivity', loadComponent: () => import('./reactivity.page').then((m) => m.ReactivityPage) },
  { path: 'bundle-analysis', loadComponent: () => import('./build-time.page').then((m) => m.BundleAnalysisPage) },
  { path: 'third-party-scripts', loadComponent: () => import('./third-party-scripts.page').then((m) => m.ThirdPartyScriptsPage) },
  { path: 'multi-host-deployment', loadComponent: () => import('./build-time.page').then((m) => m.MultiHostDeploymentPage) },
];
