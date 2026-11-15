import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Host target is chosen by env var: NETLIFY=1, CLOUDFLARE=1, VERCEL=1, otherwise Node/Express.
const target = process.env.NETLIFY
  ? 'netlify'
  : process.env.CLOUDFLARE
    ? 'cloudflare'
    : 'node'; // Vercel (VERCEL=1) runs the Express build behind api/index.js

const result = spawnSync('pnpm', ['exec', 'ng', 'build', '--configuration', `production,${target}`], {
  stdio: 'inherit',
});
if (result.status === 0 && process.env.VERCEL) {
  // Vercel would otherwise serve the CSR shell statically for `/`; SSR must handle it.
  rmSync('dist/angular-books/browser/index.csr.html', { force: true });
}
process.exit(result.status ?? 1);
