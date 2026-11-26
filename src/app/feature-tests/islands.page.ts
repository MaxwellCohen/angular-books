import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StaticCard } from './static-card';
import { CounterIsland } from './counter-island';

/**
 * Incremental hydration: both blocks are server-rendered. `hydrate never` keeps the static
 * card dehydrated forever (its chunk is never downloaded); `hydrate on interaction`
 * downloads + hydrates the counter on first interaction and replays the event.
 */
@Component({
  selector: 'ft-islands-page',
  imports: [StaticCard, CounterIsland],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-6">
      <h1 class="text-xl font-semibold">Islands (incremental hydration)</h1>
      @defer (hydrate never) {
        <ft-static-card />
      }
      @defer (hydrate on interaction) {
        <ft-counter-island />
      }
    </section>
  `,
})
export class IslandsPage {}
