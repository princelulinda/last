import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantBillComponent } from './merchant-bill.component';

describe('MerchantBillComponent', () => {
  let component: MerchantBillComponent;
  let fixture: ComponentFixture<MerchantBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantBillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
