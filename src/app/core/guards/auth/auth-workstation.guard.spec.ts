import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthWorkstationGuard } from './auth-workstation.guard';

describe('AuthworkstationGuard', () => {
  let guard: AuthWorkstationGuard;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthWorkstationGuard,
        { provide: Router, useValue: { navigate: '' } }, // Mock Router
        {
          // Mock authentication service (replace with actual if needed)
          // provide: AuthService,
          useValue: { isAuthenticated: () => of(true) }, // Mock to return true (modify for different scenarios)
        },
      ],
    });
    guard = TestBed.inject(AuthWorkstationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
