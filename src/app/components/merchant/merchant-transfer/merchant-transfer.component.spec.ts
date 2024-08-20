import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTransferComponent } from './merchant-transfer.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
describe('MerchantTransferComponent', () => {
  let component: MerchantTransferComponent;
  let fixture: ComponentFixture<MerchantTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantTransferComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
