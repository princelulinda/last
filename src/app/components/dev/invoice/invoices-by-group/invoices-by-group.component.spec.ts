import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesByGroupComponent } from './invoices-by-group.component';

describe('InvoicesByGroupComponent', () => {
  let component: InvoicesByGroupComponent;
  let fixture: ComponentFixture<InvoicesByGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesByGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesByGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
