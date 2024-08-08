import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsReportsComponent } from './bills-reports.component';

describe('BillsReportsComponent', () => {
  let component: BillsReportsComponent;
  let fixture: ComponentFixture<BillsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsReportsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
