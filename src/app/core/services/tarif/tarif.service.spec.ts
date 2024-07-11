import { TestBed } from '@angular/core/testing';
import { TarifService } from './tarif.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TarifService', () => {
  let service: TarifService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
      ],
    });
    service = TestBed.inject(TarifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
