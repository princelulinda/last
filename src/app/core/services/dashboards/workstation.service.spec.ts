import { TestBed } from '@angular/core/testing';

import { WorkstationService } from './workstation.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WorkstationService', () => {
  let service: WorkstationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkstationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
