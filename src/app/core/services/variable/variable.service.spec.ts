import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { VariableService } from './variable.service';

describe('VariableService', () => {
  let service: VariableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VariableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
