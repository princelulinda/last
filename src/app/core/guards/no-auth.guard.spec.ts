// import { TestBed } from '@angular/core/testing';
// import { CanActivate } from '@angular/router';

// import { NoAuthGuard } from './no-auth.guard';

// describe('noAuthGuard', () => {
//   const executeGuard: CanActivate = (...guardParameters) =>
//     TestBed.runInInjectionContext(() => new NoAuthGuard().canActivate(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'; // Import Router for navigation testing
// import { Observable, of } from 'rxjs'; // Import Observable and of for mocking authentication service
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  // let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NoAuthGuard,
        { provide: Router, useValue: { navigate: '' } },
      ], // Mock Router
    });
    guard = TestBed.inject(NoAuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // it('should allow access when not authenticated', () => {
  //   const shouldAllow = guard.canActivate(null, null); // Pass null for route/state (optional)
  //   expect(shouldAllow).toBe(true); // Expect true for unauthenticated access
  // });

  // it('should not call router.navigate() when not authenticated', () => {
  //   guard.canActivate(null, null); // Pass null for route/state (optional)
  //   expect(router.navigate).not.toHaveBeenCalled(); // Verify no navigation
  // });

  // (Optional) Mock authentication service for more complex scenarios
  // it('should redirect to login if authenticated', () => {
  //   const authService = { isAuthenticated: () => of(true) }; // Mock authenticated service

  //   // Inject the mock service (modify if needed)
  //   TestBed.overrideProvider(AuthService, { useValue: authService });
  //   guard = TestBed.inject(NoAuthGuard);

  //   const shouldAllow = guard.canActivate(null, null); // Pass null for route/state (optional)
  //   expect(shouldAllow).toBe(false); // Expect false for authenticated access
  //   expect(router.navigate).toHaveBeenCalledWith(['/login']); // Verify redirect
  // });
});
