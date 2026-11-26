import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FEATURE_IDS } from './feature-tests.routes';

@Component({
  selector: 'ft-index-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Feature tests</h1>
      <ul class="mt-4 list-disc pl-6">
        @for (id of ids; track id) {
          <li><a class="underline" [routerLink]="['/feature-tests', id]">{{ id }}</a></li>
        }
      </ul>
    </section>
  `,
})
export class FeatureTestsIndexPage {
  protected readonly ids = FEATURE_IDS;
}
