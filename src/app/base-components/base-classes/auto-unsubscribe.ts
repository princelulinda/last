import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable()
export class AutoUnsubscribe implements OnDestroy {
  private destroy$ = new Subject<void>();

  protected autoUnsubscribe<T>() {
    return takeUntil<T>(this.destroy$);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected destroyed = this.destroy$.pipe(map(() => null));
}
