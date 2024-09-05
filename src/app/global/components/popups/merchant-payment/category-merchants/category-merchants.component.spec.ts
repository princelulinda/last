import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMerchantsComponent } from './category-merchants.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CategoryMerchantsComponent', () => {
  let component: CategoryMerchantsComponent;
  let fixture: ComponentFixture<CategoryMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMerchantsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
