import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantConfigComponent } from './merchant-config.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantConfigComponent', () => {
  let component: MerchantConfigComponent;
  let fixture: ComponentFixture<MerchantConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantConfigComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
