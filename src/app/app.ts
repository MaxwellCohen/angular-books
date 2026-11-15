import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookSearch } from './book/book-search';
import { BookSidebar } from './book/book-sidebar';
import { MobileSidebarPanel, MobileSidebarTrigger } from './book/mobile-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BookSearch, BookSidebar, MobileSidebarPanel, MobileSidebarTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <div class="group flex min-h-dvh">
      <aside
        class="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r px-5 py-5 md:flex"
      >
        <app-book-sidebar idPrefix="desktop" />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="border-divider bg-surface/80 dark:border-divider-dark dark:bg-surface-dark/80 sticky top-0 z-20 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6"
        >
          <app-mobile-sidebar-trigger />
          <app-book-search />
        </header>

        <main class="flex min-w-0 flex-1 flex-col">
          <router-outlet />
        </main>
      </div>
    </div>
    <app-mobile-sidebar />
  `,
})
export class App {}
