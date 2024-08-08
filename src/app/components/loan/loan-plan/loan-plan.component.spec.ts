import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPlanComponent } from './loan-plan.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoanPlanComponent', () => {
  let component: LoanPlanComponent;
  let fixture: ComponentFixture<LoanPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPlanComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
