import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { workstationGuard } from './workstation.guard';

describe('workstationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => workstationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
