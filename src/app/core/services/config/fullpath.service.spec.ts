import { TestBed } from '@angular/core/testing';

import { FullpathService } from './fullpath.service';

describe('FullpathService', () => {
  let service: FullpathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullpathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
