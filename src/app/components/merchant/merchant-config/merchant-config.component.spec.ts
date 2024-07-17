import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantConfigComponent } from './merchant-config.component';

describe('MerchantConfigComponent', () => {
  let component: MerchantConfigComponent;
  let fixture: ComponentFixture<MerchantConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
