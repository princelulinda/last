import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPaymentComponent } from './merchant-payment.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantPaymentComponent', () => {
  let component: MerchantPaymentComponent;
  let fixture: ComponentFixture<MerchantPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantPaymentComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
