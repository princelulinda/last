import { TestBed } from '@angular/core/testing';
import {
  CanDeactivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { windowGuard } from './window.guard';

describe('windowGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) =>
    TestBed.runInInjectionContext(() =>
      windowGuard(component, currentRoute, currentState, nextState)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
