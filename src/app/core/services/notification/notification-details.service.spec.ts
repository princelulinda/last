import { TestBed } from '@angular/core/testing';

import { NotificationDetailsService } from './notification-details.service';

describe('NotificationDetailsService', () => {
  let service: NotificationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
