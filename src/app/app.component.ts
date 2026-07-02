import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestTimerOverlay } from './features/workout-log/components/rest-timer-overlay/rest-timer-overlay';

@Component({
  selector: 'app-root',
  template: `
    <main>
      <router-outlet />
    </main>
    <app-rest-timer-overlay />
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: sans-serif;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RestTimerOverlay]
})
export class AppComponent {}
