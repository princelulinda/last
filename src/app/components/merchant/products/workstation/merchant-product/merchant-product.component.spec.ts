import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantProductComponent } from './merchant-product.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantProductComponent', () => {
  let component: MerchantProductComponent;
  let fixture: ComponentFixture<MerchantProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantProductComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
