import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductComponent],
      providers: [provideHttpClient(), ActivatedRoute],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
