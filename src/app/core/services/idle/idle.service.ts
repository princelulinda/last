import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
import {
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private readonly idleTimeout = 15 * 60 * 1000; // 60 seconds
  private idle$: Observable<boolean>;
  private resetIdle$ = new Subject<void>();

  constructor() {
    this.idle$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'keypress')
    ).pipe(
      tap(() => this.resetIdle$.next()), // reset on any event
      switchMap(() => timer(this.idleTimeout).pipe(map(() => true)))
    );

    this.startWatching();
  }

  startWatching() {
    this.idle$.subscribe(() => {
      this.lockScreen();
    });
  }

  private lockScreen() {
    const element = document.getElementById('standby');
    element?.classList.remove('stop');
    element?.classList.add('stand');
    console.log('lock screen');
  }
}
