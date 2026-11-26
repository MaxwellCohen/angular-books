// Builds the production app (node target + feature-test index), serves it on PORT (Playwright webServer)
// and runs every feature spec; results land in feature-tests/results.json.
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bin = (name) => join(root, 'node_modules/.bin', name);
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: { ...process.env, FT_PORT: process.env.FT_PORT ?? '4125' } }).status ?? 1;

if (run(bin('ng'), ['build', '-c', 'production,node,featuretests']) !== 0) process.exit(1);
process.exit(run(bin('playwright'), ['test', '-c', 'feature-tests/playwright.config.ts', ...process.argv.slice(2)]));
