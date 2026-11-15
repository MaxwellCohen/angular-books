import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ThemeService } from '../core/theme';
import type { Theme } from '../core/theme';
import { Icon } from './icon';
import type { IconName } from './icon';

@Component({
  selector: 'app-theme-toggle',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClass()' },
  template: `
    @for (option of options; track option.theme) {
      <button
        [attr.aria-label]="option.label"
        [attr.aria-pressed]="themeService.theme() === option.theme ? 'true' : 'false'"
        [class]="buttonClass(option.theme)"
        type="button"
        (click)="themeService.setTheme(option.theme)"
      >
        <app-icon class="size-4" [name]="option.icon" />
      </button>
    }
  `,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
  readonly variant = input<'inline' | 'pill'>('pill');

  protected readonly options: { icon: IconName; label: string; theme: Theme }[] = [
    { icon: 'sun', label: 'Light mode', theme: 'light' },
    { icon: 'moon', label: 'Dark mode', theme: 'dark' },
    { icon: 'monitor', label: 'System theme', theme: 'system' },
  ];

  protected hostClass() {
    return this.variant() === 'inline'
      ? 'inline-flex items-center gap-0.5'
      : 'border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5';
  }

  protected buttonClass(theme: Theme) {
    return this.themeService.theme() === theme
      ? 'rounded-full p-1.5 transition-colors bg-card dark:bg-card-dark text-black dark:text-white'
      : 'rounded-full p-1.5 transition-colors text-muted hover:text-black dark:hover:text-white';
  }
}
