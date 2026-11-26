import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { evidence } from './helpers';

const root = join(__dirname, '..');

function build(target: string) {
  const out = join(root, 'dist-ft', target);
  rmSync(out, { recursive: true, force: true });
  execFileSync(join(root, 'node_modules/.bin/ng'), ['build', '-c', `production,${target}`, '--output-path', out], {
    cwd: root,
    stdio: 'pipe',
  });
  return out;
}

test('builds for node, cloudflare and netlify targets', async () => {
  test.setTimeout(600_000);
  const seen: string[] = [];
  for (const target of ['node', 'cloudflare', 'netlify']) {
    const out = build(target);
    const server = join(out, 'server/server.mjs');
    expect(existsSync(join(out, 'browser/index.csr.html')), `${target}: browser output`).toBe(true);
    expect(existsSync(server), `${target}: server entry`).toBe(true);
    const code = readFileSync(server, 'utf8');
    if (target === 'node') expect(code).toMatch(/express|listen\(/);
    if (target === 'cloudflare') expect(code).not.toMatch(/express|listen\(/);
    if (target === 'netlify') expect(code).toContain('netlifyAppEngineHandler');
    seen.push(`${target} -> dist-ft/${target}/{browser,server/server.mjs} (${(code.length / 1024).toFixed(0)} KB)`);
  }
  evidence(`${seen.join('; ')}; Vercel reuses the node build via api/index.js; each host needs a hand-written SSR entry`);
});
