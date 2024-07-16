import { TestBed } from '@angular/core/testing';
import { PlateformGuard } from './plateform.guard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('plateformGuard', () => {
  let guard: PlateformGuard;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PlateformGuard,
      ],
    });
    guard = TestBed.inject(PlateformGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
