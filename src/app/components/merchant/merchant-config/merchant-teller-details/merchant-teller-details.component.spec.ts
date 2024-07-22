import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantTellerDetailsComponent } from './merchant-teller-details.component';

describe('MerchantTellerDetailsComponent', () => {
  let component: MerchantTellerDetailsComponent;
  let fixture: ComponentFixture<MerchantTellerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchantTellerDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantTellerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
