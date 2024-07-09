import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBillComponent } from './transfer-bill.component';

describe('TransferBillComponent', () => {
  let component: TransferBillComponent;
  let fixture: ComponentFixture<TransferBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferBillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
