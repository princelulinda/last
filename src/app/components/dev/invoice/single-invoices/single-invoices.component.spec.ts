import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInvoicesComponent } from './single-invoices.component';

describe('SingleInvoicesComponent', () => {
  let component: SingleInvoicesComponent;
  let fixture: ComponentFixture<SingleInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleInvoicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
