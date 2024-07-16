import { TestBed } from '@angular/core/testing';

import { BankingService } from './banking.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BankingService', () => {
  let service: BankingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BankingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
