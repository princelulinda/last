import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartementsDetailsComponent } from './admin-departements-details.component';

describe('AdminDepartementsDetailsComponent', () => {
  let component: AdminDepartementsDetailsComponent;
  let fixture: ComponentFixture<AdminDepartementsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDepartementsDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDepartementsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
