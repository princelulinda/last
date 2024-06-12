// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';

// import { AuthGuard } from './auth.guard';

// describe('authGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) =>
//     TestBed.runInInjectionContext(() => AuthGuard.canActivate(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  // let router: Router;
  // let authService: { isAuthenticated: () => Observable<boolean> }; // Mock authentication service

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthGuard,
        { provide: Router, useValue: { navigate: '' } }, // Mock Router
        {
          // Mock authentication service (replace with actual if needed)
          // provide: AuthService,
          useValue: { isAuthenticated: () => of(true) }, // Mock to return true (modify for different scenarios)
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    // router = TestBed.inject(Router);
    // authService = TestBed.inject(AuthService); // Inject mock service
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // it('should allow access when authenticated', () => {
  //   const shouldAllow = guard.canActivate(null, null); // Pass null for route/state (optional)
  //   expect(shouldAllow).toBeInstanceOf(Observable); // Expect observable for asynchronous behavior
  //   (shouldAllow as Observable<boolean>).subscribe(allowed => expect(allowed).toBe(true)); // Verify allowed access
  // });

  // it('should call router.navigate() when not authenticated', () => {
  //   // Modify mock service to return false (replace with actual authentication logic)
  //   authService.isAuthenticated = () => of(false);

  //   const shouldAllow = guard.canActivate(null, null); // Pass null for route/state (optional)
  //   expect(shouldAllow).toBeInstanceOf(Observable); // Expect observable for asynchronous behavior
  //   (shouldAllow as Observable<boolean>).subscribe(allowed => expect(allowed).toBe(false)); // Verify denied access
  //   expect(router.navigate).toHaveBeenCalledWith(['/login']); // Verify redirect
  // });
});
