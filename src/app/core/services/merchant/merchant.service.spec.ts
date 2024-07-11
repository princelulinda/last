import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MerchantService } from './merchant.service';

describe('MerchantService', () => {
  let service: MerchantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Import HttpClientModule here
      providers: [MerchantService],
    });
    service = TestBed.inject(MerchantService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });
});
