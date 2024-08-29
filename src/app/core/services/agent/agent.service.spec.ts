import { TestBed } from '@angular/core/testing';

import { AgentService } from './agent.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AgentService', () => {
  let service: AgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(AgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
