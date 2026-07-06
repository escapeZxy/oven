import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RestTimerService } from '../../services/rest-timer';

@Component({
  selector: 'app-rest-timer-overlay',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    @if (timer.isActive()) {
      <div
        class="slide-in fixed bottom-24 left-4 right-4 z-50 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 text-white shadow-2xl backdrop-blur-md sm:left-auto sm:right-6 sm:w-80"
        style="bottom: calc(env(safe-area-inset-bottom, 0px) + 6rem);">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
          <div class="flex items-center gap-2 font-bold text-indigo-400">
            <mat-icon class="!w-5 !h-5 !text-xl animate-pulse">timer</mat-icon>
            <span>组间休息</span>
          </div>
          <button mat-icon-button class="!text-slate-400 hover:!text-white !w-8 !h-8" (click)="timer.stop()">
            <mat-icon class="!text-lg">close</mat-icon>
          </button>
        </div>

        <!-- Timer Display -->
        <div class="space-y-4 p-4 text-center sm:p-5">
          <div class="font-mono text-4xl font-black tracking-wider tabular-nums sm:text-5xl">
            {{ formatTime(timer.remainingTime()) }}
          </div>

          <div class="space-y-2">
            <mat-progress-bar mode="determinate" [value]="timer.progress()" class="!h-1.5 !rounded-full !bg-slate-700"></mat-progress-bar>
            <div class="flex justify-between text-xs text-slate-400 font-mono">
              <span>+30s</span>
              <span>SKIP</span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <button mat-stroked-button class="!border-slate-600 !text-slate-300 hover:!bg-slate-800" (click)="timer.addTime(30)">
              +30 秒
            </button>
            <button mat-flat-button color="primary" (click)="timer.stop()">
              结束休息
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    /* Material Progress Bar Override for Dark Theme */
    ::ng-deep .mat-mdc-progress-bar .mdc-linear-progress__bar-inner {
      border-color: #818cf8 !important; /* Indigo-400 */
    }

    .slide-in {
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `
})
export class RestTimerOverlay {
  protected readonly timer = inject(RestTimerService);

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
