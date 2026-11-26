import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { evidence } from './helpers';

const root = join(__dirname, '..');
const out = join(root, 'dist-ft/stats');

test('ng build --stats-json + esbuild-visualizer produce an analysis report', async () => {
  test.setTimeout(300_000);
  rmSync(out, { recursive: true, force: true });
  execFileSync(join(root, 'node_modules/.bin/ng'), ['build', '-c', 'production,node', '--stats-json', '--output-path', out], {
    cwd: root,
    stdio: 'pipe',
  });
  const stats = join(out, 'browser-stats.json');
  expect(existsSync(stats)).toBe(true);
  const meta = JSON.parse(readFileSync(stats, 'utf8'));
  expect(Object.keys(meta.outputs ?? {}).length).toBeGreaterThan(0);

  const report = join(out, 'report.html');
  execFileSync(join(root, 'node_modules/.bin/esbuild-visualizer'), ['--metadata', stats, '--filename', report], { cwd: root, stdio: 'pipe' });
  expect(existsSync(report)).toBe(true);
  expect(readFileSync(report, 'utf8')).toContain('<html');
  evidence(
    `browser-stats.json (${Object.keys(meta.inputs).length} inputs, ${Object.keys(meta.outputs).length} outputs) from first-party --stats-json; ` +
      `report.html ${(statSync(report).size / 1024).toFixed(0)} KB from third-party esbuild-visualizer (no first-party viewer)`,
  );
});
