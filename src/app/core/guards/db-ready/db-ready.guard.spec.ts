import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dbReadyGuard } from './db-ready.guard';

describe('dbReadyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => dbReadyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
