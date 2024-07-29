import { TestBed } from '@angular/core/testing';

import { SimpleMerchantService } from './simple-merchant.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SimpleMerchantService', () => {
  let service: SimpleMerchantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SimpleMerchantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
