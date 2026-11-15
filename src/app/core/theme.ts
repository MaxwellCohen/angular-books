import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('system');

  constructor() {
    if (!this.browser) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') this.theme.set(stored);
    } catch {
      // Storage unavailable.
    }
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', () => this.apply());
  }

  setTheme(next: Theme) {
    this.theme.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable.
    }
    this.apply();
  }

  private apply() {
    if (!this.browser) return;
    const theme = this.theme();
    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    this.document.documentElement.classList.toggle('dark', dark);
  }
}
