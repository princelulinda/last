import { TestBed } from '@angular/core/testing';

import { SavingDetailService } from './saving.service';

describe('SavingService', () => {
  let service: SavingDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavingDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
