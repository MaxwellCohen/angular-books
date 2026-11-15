import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-book-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg aria-hidden="true" class="size-full" fill="none" viewBox="0 0 24 24">
      <g
        [class]="animated() ? 'book-mark-enter' : ''"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.75"
      >
        <path d="M12 6.5C10.4 5.2 8.4 4.5 6 4.5H3.5v13H6c2.4 0 4.4.7 6 2" />
        <path d="M12 6.5c1.6-1.3 3.6-2 6-2h2.5v13H18c-2.4 0-4.4.7-6 2" />
        <path d="M12 6.5v15" />
      </g>
    </svg>
  `,
})
export class BookMark {
  readonly animated = input(false);
}

@Component({
  selector: 'app-github-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex shrink-0' },
  template: `
    <svg aria-hidden="true" class="size-full" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  `,
})
export class GitHubIcon {}

@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex size-4 shrink-0' },
  template: `
    <svg aria-hidden="true" class="size-full animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
      <path
        class="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="3"
      />
    </svg>
  `,
})
export class Spinner {}

@Component({
  selector: 'app-star-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center gap-0.5',
    role: 'img',
    '[attr.aria-label]': 'label()',
  },
  template: `
    @for (active of stars(); track $index) {
      <svg
        aria-hidden="true"
        [class]="active ? 'size-4 fill-current text-warning' : 'size-4 fill-current text-divider dark:text-divider-dark'"
        viewBox="0 0 24 24"
      >
        <path d="M12 2.5 14.9 8.7l6.8.6-5.2 4.6 1.6 6.6L12 17.3 5.9 20.5l1.6-6.6-5.2-4.6 6.8-.6z" />
      </svg>
    }
  `,
})
export class StarRating {
  readonly rating = input.required<number>();
  protected readonly label = computed(() => `Rated ${this.rating().toFixed(1)} out of 5`);
  protected readonly stars = computed(() => {
    const rounded = Math.round(this.rating() * 2) / 2;
    return [0, 1, 2, 3, 4].map((index) => index + 1 <= rounded || index + 0.5 === rounded);
  });
}

