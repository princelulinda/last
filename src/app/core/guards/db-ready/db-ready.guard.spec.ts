// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';

// import { DBReadyGuard, dbReadyGuard } from './db-ready.guard';

// describe('dbReadyGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) =>
//     TestBed.runInInjectionContext(() => dbReadyGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });

import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DBReadyGuard } from './db-ready.guard';
import { TestBed } from '@angular/core/testing';

describe('AuthGuard', () => {
  let guard: DBReadyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DBReadyGuard,
        {
          useValue: { isAuthenticated: () => of(true) }, // Mock to return true (modify for different scenarios)
        },
      ],
    });
    guard = TestBed.inject(DBReadyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
