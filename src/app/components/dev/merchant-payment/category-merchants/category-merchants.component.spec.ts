import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMerchantsComponent } from './category-merchants.component';

describe('CategoryMerchantsComponent', () => {
  let component: CategoryMerchantsComponent;
  let fixture: ComponentFixture<CategoryMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryMerchantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
