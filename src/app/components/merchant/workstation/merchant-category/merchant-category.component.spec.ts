import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCategoryComponent } from './merchant-category.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MerchantCategoryComponent', () => {
  let component: MerchantCategoryComponent;
  let fixture: ComponentFixture<MerchantCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantCategoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
