import { TestBed } from '@angular/core/testing';

import { NotificationDetailsService } from './notification-details.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('NotificationDetailsService', () => {
  let service: NotificationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(NotificationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
