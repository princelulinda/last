import { TestBed } from '@angular/core/testing';

import { NewsFeedService } from './news-feed.service';
import { provideHttpClient } from '@angular/common/http';

describe('NewsFeedService', () => {
  let service: NewsFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(NewsFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
