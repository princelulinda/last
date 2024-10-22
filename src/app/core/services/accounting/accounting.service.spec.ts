import { TestBed } from '@angular/core/testing';

import { AccountingService } from './accounting.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AccountingService', () => {
  let service: AccountingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AccountingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
