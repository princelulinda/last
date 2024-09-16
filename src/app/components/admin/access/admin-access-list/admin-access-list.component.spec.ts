import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessListComponent } from './admin-access-list.component';

describe('AdminAccessListComponent', () => {
  let component: AdminAccessListComponent;
  let fixture: ComponentFixture<AdminAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
