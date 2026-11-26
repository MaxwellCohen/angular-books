import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ft-bundle-analysis-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Bundle analysis (build-time)</h1>
      <p class="mt-2">
        <code>ng build --stats-json</code> writes <code>stats.json</code> (esbuild metafile). The viewer is
        third-party: <code>esbuild-visualizer --metadata stats.json --filename report.html</code>.
        See feature-tests/bundle-analysis.spec.ts.
      </p>
    </section>
  `,
})
export class BundleAnalysisPage {}

@Component({
  selector: 'ft-multi-host-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Multi-host deployment (build-time)</h1>
      <p class="mt-2">
        Hand-written per-host SSR entries picked by angular.json configurations: <code>node</code>
        (src/server.ts, Express + AngularNodeAppEngine; also used by Vercel via api/index.js),
        <code>cloudflare</code> (src/server.cloudflare.ts, AngularAppEngine, platform neutral) and
        <code>netlify</code> (src/server.netlify.ts). See feature-tests/multi-host-deployment.spec.ts.
      </p>
    </section>
  `,
})
export class MultiHostDeploymentPage {}
