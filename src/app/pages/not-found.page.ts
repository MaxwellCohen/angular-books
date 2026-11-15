import { ChangeDetectionStrategy, Component, RESPONSE_INIT, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { buttonClasses } from '../ui/button';
import { EmptyState } from '../ui/states';

@Component({
  selector: 'app-not-found-page',
  imports: [EmptyState, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-1 flex-col' },
  template: `
    <app-empty-state body="That page isn't in the catalog." title="Page not found">
      <a [class]="homeClass" routerLink="/">Back to the shelf</a>
    </app-empty-state>
  `,
})
export class NotFoundPage {
  protected readonly homeClass = buttonClasses({ class: 'mt-1', variant: 'secondary' });

  constructor() {
    inject(Title).setTitle('Not found · Angular Books');
    const response = inject(RESPONSE_INIT, { optional: true });
    if (response) response.status = 404;
  }
}
