import { defineConfig } from '@playwright/test';

export const PORT = Number(process.env['FT_PORT'] ?? 4125);

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [['list'], ['./results-reporter.ts']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { executablePath: '/home/maxc/.local/bin/google-chrome' },
  },
  webServer: {
    command: 'node dist/angular-books/server/server.mjs',
    cwd: '..',
    url: `http://localhost:${PORT}/feature-tests`,
    env: { PORT: String(PORT) },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
