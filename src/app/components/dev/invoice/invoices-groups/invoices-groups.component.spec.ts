import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesGroupsComponent } from './invoices-groups.component';

describe('InvoicesGroupsComponent', () => {
  let component: InvoicesGroupsComponent;
  let fixture: ComponentFixture<InvoicesGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
