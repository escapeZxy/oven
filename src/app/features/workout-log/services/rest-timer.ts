import { DestroyRef, Injectable, computed, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map, takeWhile, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestTimerService {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _remainingTime$ = new BehaviorSubject<number>(0);

  // Expose state as Signals
  readonly remainingTime = toSignal(this._remainingTime$, { initialValue: 0 });
  readonly isActive = computed(() => this.remainingTime() > 0);
  readonly progress = computed(() => {
    const remaining = this.remainingTime();
    const total = this._totalDuration || 60; // Fallback to 60s if total is unknown
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  });

  private _totalDuration = 0;
  private _timerSubscription: any = null;

  constructor() {
    // No initialization needed for now
  }

  start(seconds: number) {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
    }

    this._totalDuration = seconds;
    const endTime = Date.now() + seconds * 1000;
    
    // RxJS Timer Engine: 
    // 1. Emits every 100ms for smoother updates
    // 2. Calculates diff from system clock (Date.now()) to prevent drift
    // 3. Auto-stops when time <= 0
    this._timerSubscription = timer(0, 100).pipe(
      map(() => Math.max(0, Math.ceil((endTime - Date.now()) / 1000))),
      takeWhile(val => val >= 0),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: (val) => {
        // Only update if value changed to avoid signal churn
        if (this._remainingTime$.value !== val) {
          this._remainingTime$.next(val);
        }
      },
      complete: () => {
        this._remainingTime$.next(0);
        this._playNotificationSound();
        this._timerSubscription = null;
      }
    });
  }

  stop() {
    if (this._timerSubscription) {
      this._timerSubscription.unsubscribe();
      this._timerSubscription = null;
    }
    this._remainingTime$.next(0);
  }

  addTime(seconds: number) {
    if (this.isActive()) {
      const current = this.remainingTime();
      this.start(current + seconds);
    } else {
      this.start(seconds);
    }
  }
  
  private _playNotificationSound() {
    // Simple beep or vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    // We could add AudioContext beep here later
  }
}
