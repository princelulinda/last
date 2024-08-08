import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authWorkstationGuard } from './auth-workstation.guard';

describe('authWorkstationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      authWorkstationGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
