import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReportsComponent } from './payment-reports.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PaymentReportsComponent', () => {
  let component: PaymentReportsComponent;
  let fixture: ComponentFixture<PaymentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
