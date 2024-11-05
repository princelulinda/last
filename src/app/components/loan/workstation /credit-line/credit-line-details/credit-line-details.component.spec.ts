import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineDetailsComponent } from './credit-line-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('CreditLineDetailsComponent', () => {
  let component: CreditLineDetailsComponent;
  let fixture: ComponentFixture<CreditLineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      imports: [CreditLineDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditLineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
