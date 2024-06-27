import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SavingDetailService } from './saving.service';

describe('SavingService', () => {
  let service: SavingDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SavingDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
