import { TestBed } from '@angular/core/testing';

import { CreditService } from './credit.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreditService', () => {
  let service: CreditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CreditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
