import { TestBed } from '@angular/core/testing';
import { SessionsService } from './sessions.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    });
    service = TestBed.inject(SessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
