import { TestBed } from '@angular/core/testing';

import { BankService } from './bank.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BankService', () => {
  let service: BankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BankService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
