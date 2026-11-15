import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MobileSidebar } from '../core/mobile-sidebar';
import { Icon } from '../ui/icon';
import { buttonClasses } from '../ui/button';
import { BookSidebar } from './book-sidebar';

@Component({
  selector: 'app-mobile-sidebar-trigger',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button aria-label="Open filters" [class]="classes" type="button" (click)="sidebar.open()">
      <app-icon class="size-4" name="sliders-horizontal" />
    </button>
  `,
})
export class MobileSidebarTrigger {
  protected readonly sidebar = inject(MobileSidebar);
  protected readonly classes = buttonClasses({ class: 'md:hidden', size: 'icon', variant: 'ghost' });
}

@Component({
  selector: 'app-mobile-sidebar',
  imports: [Icon, BookSidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'sidebar.close()' },
  template: `
    @if (sidebar.isOpen()) {
      <div
        aria-hidden="true"
        class="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] md:hidden"
        (click)="sidebar.close()"
      ></div>
      <aside
        aria-label="Book filters"
        class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-3rem))] max-w-full touch-pan-y flex-col overflow-x-hidden border-r pt-[max(1rem,env(safe-area-inset-top))] pr-4 pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] shadow-2xl md:hidden"
        (click)="onClick($event)"
      >
        <button
          aria-label="Close filters"
          class="text-muted hover:bg-card focus-visible:ring-accent dark:hover:bg-card-dark absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 grid size-9 place-items-center rounded-md hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
          type="button"
          (click)="sidebar.close()"
        >
          <app-icon class="size-5" name="x" />
        </button>
        <app-book-sidebar idPrefix="mobile" [mobile]="true" />
      </aside>
    }
  `,
})
export class MobileSidebarPanel {
  protected readonly sidebar = inject(MobileSidebar);

  protected onClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('a[href]')) this.sidebar.close();
  }
}
