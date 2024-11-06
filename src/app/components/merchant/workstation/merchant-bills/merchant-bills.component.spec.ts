import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantBillsComponent } from './merchant-bills.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('MerchantBillsComponent', () => {
  let component: MerchantBillsComponent;
  let fixture: ComponentFixture<MerchantBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantBillsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
