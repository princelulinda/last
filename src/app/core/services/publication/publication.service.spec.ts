import { TestBed } from '@angular/core/testing';

import { PublicationService } from './publication.service';
import { provideHttpClient } from '@angular/common/http';

describe('PublicationService', () => {
  let service: PublicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(PublicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
