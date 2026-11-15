import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { thumbHashToDataURL } from 'thumbhash';
import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '@/features/book/book-constants';

function thumbhashUrl(hash: string | null): string | undefined {
  if (!hash) return undefined;
  try {
    const binary = atob(hash);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return thumbHashToDataURL(bytes);
  } catch {
    return undefined;
  }
}

@Component({
  selector: 'app-book-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-card dark:bg-card-dark relative block aspect-[2/3] w-full overflow-hidden rounded-md bg-cover bg-center',
    '[style.background-image]': 'placeholder() ? "url(" + placeholder() + ")" : null',
  },
  template: `
    @if (showImage()) {
      <img
        class="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        [alt]="title()"
        [attr.fetchpriority]="priority() ? 'high' : null"
        [attr.loading]="priority() ? 'eager' : 'lazy'"
        [attr.sizes]="sizes()"
        [src]="readySrc()"
        (error)="failedSrc.set(readySrc())"
      />
    } @else {
      <div
        role="img"
        [attr.aria-label]="'Cover unavailable for ' + title()"
        class="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
      >
        Cover unavailable
      </div>
    }
  `,
})
export class BookCover {
  readonly title = input.required<string>();
  readonly src = input.required<string | null>();
  readonly thumbhash = input.required<string | null>();
  readonly sizes = input.required<string>();
  readonly priority = input(false);

  protected readonly failedSrc = signal<string | null>(null);
  protected readonly readySrc = computed(() => getLargeBookImageUrl(this.src() ?? EMPTY_IMAGE_URL));
  protected readonly placeholder = computed(() => thumbhashUrl(this.thumbhash()));
  protected readonly showImage = computed(() => this.readySrc() !== this.failedSrc());
}
