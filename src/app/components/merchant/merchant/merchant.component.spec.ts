import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantComponent } from './merchant.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GlobalMapComponent } from '../../dev/global-map/global-map.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MerchantComponent', () => {
  let component: MerchantComponent;
  let fixture: ComponentFixture<MerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantComponent, GlobalMapComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
