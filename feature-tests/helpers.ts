import { test } from '@playwright/test';

/** Records a one-line observation that ends up in results.json `evidence`. */
export function evidence(text: string) {
  test.info().annotations.push({ type: 'evidence', description: text });
}
