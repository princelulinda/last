import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPendingComponent } from './loan-pending.component';

describe('LoanPendingComponent', () => {
  let component: LoanPendingComponent;
  let fixture: ComponentFixture<LoanPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
