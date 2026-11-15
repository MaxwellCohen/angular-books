import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BookMark } from './glyphs';
import { Icon } from './icon';

@Component({
  selector: 'app-empty-state',
  imports: [BookMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid flex-1 place-items-center px-6 py-20 text-center' },
  template: `
    <div class="flex max-w-sm flex-col items-center gap-3">
      <app-book-mark [animated]="true" class="mb-1 size-10" />
      <p class="text-sm font-medium">{{ title() }}</p>
      @if (body()) {
        <p class="text-muted text-sm leading-6">{{ body() }}</p>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly body = input<string>();
}

@Component({
  selector: 'app-error-state',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    @if (compact()) {
      <div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
        <app-icon class="text-danger size-4" name="alert-triangle" />
        <p class="text-muted text-xs">{{ title() }}</p>
        @if (body()) {
          <p class="text-muted text-xs leading-5">{{ body() }}</p>
        }
        <ng-content />
      </div>
    } @else {
      <div class="grid flex-1 place-items-center px-6 py-20 text-center">
        <div class="flex max-w-sm flex-col items-center gap-3">
          <app-icon class="text-danger size-6" name="alert-triangle" />
          <p class="text-sm font-medium text-black dark:text-white">{{ title() }}</p>
          @if (body()) {
            <p class="text-muted text-sm leading-6">{{ body() }}</p>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ErrorState {
  readonly title = input('Something went wrong');
  readonly body = input<string>();
  readonly compact = input(false);
}
