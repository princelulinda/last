import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServicesListComponent } from './admin-services-list.component';

describe('AdminServicesListComponent', () => {
  let component: AdminServicesListComponent;
  let fixture: ComponentFixture<AdminServicesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminServicesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServicesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
