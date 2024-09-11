import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBranchDetailsComponent } from './admin-branch-details.component';

describe('AdminBranchDetailsComponent', () => {
  let component: AdminBranchDetailsComponent;
  let fixture: ComponentFixture<AdminBranchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBranchDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBranchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
