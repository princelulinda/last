import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTransferComponent } from './merchant-transfer.component';

describe('MerchantTransferComponent', () => {
  let component: MerchantTransferComponent;
  let fixture: ComponentFixture<MerchantTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantTransferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
