import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { FEATURES } from './meta';

type Entry = {
  claimedLabel: string;
  status: 'pass' | 'fail' | 'blocked';
  method: string;
  evidence: string;
  suggestedLabel?: string;
  test: string;
};

const oneLine = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').trim();

/** Collects one result per feature spec and writes feature-tests/results.json. */
export default class ResultsReporter implements Reporter {
  private results: Record<string, Entry> = {};

  onTestEnd(test: TestCase, result: TestResult) {
    const file = basename(test.location.file);
    const featureId = file.replace(/\.spec\.ts$/, '');
    const meta = FEATURES[featureId];
    if (!meta) return;
    const blocked = test.annotations.find((a) => a.type === 'blocked');
    const evidence = test.annotations
      .filter((a) => a.type === 'evidence')
      .map((a) => a.description ?? '')
      .join('; ');
    const passed = result.status === 'passed';
    const error = result.error?.message ? oneLine(result.error.message).slice(0, 300) : '';
    this.results[featureId] = {
      claimedLabel: meta.claimedLabel,
      status: blocked ? 'blocked' : passed ? 'pass' : 'fail',
      method: meta.method,
      evidence: oneLine([evidence, !passed && error ? `assertion: ${error}` : ''].filter(Boolean).join('; ')),
      ...(meta.suggestedLabel && !passed ? { suggestedLabel: meta.suggestedLabel } : {}),
      test: `feature-tests/${file}`,
    };
  }

  onEnd(_result: FullResult) {
    const order = Object.keys(FEATURES);
    const results = Object.fromEntries(order.filter((id) => this.results[id]).map((id) => [id, this.results[id]]));
    const out = {
      framework: 'angular',
      repo: 'angular-books',
      commit: execSync('git rev-parse HEAD').toString().trim(),
      ranAt: new Date().toISOString(),
      results,
    };
    writeFileSync(join(__dirname, 'results.json'), JSON.stringify(out, null, 2) + '\n');
  }
}
