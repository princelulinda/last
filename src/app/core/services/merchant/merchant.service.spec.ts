import { TestBed } from '@angular/core/testing';
// import { HttpClientModule } from '@angular/common/http';

import { MerchantService } from './merchant.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantService', () => {
  let service: MerchantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MerchantService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });
});
