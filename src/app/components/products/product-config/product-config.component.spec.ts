import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigComponent } from './product-config.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductConfigComponent', () => {
  let component: ProductConfigComponent;
  let fixture: ComponentFixture<ProductConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductConfigComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
