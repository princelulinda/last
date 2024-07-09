import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanHomeComponent } from './loan-home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('LoanHomeComponent', () => {
  let component: LoanHomeComponent;
  let fixture: ComponentFixture<LoanHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanHomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
