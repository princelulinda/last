import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartementsListComponent } from './admin-departements-list.component';

describe('AdminDepartementsListComponent', () => {
  let component: AdminDepartementsListComponent;
  let fixture: ComponentFixture<AdminDepartementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDepartementsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDepartementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
