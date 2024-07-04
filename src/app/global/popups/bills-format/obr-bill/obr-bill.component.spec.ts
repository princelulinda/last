import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObrBillComponent } from './obr-bill.component';

describe('ObrBillComponent', () => {
  let component: ObrBillComponent;
  let fixture: ComponentFixture<ObrBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObrBillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObrBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
