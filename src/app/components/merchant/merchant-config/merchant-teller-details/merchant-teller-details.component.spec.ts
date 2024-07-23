import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTellerDetailsComponent } from './merchant-teller-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantTellerDetailsComponent', () => {
  let component: MerchantTellerDetailsComponent;
  let fixture: ComponentFixture<MerchantTellerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantTellerDetailsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantTellerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
