import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCounterListComponent } from './admin-counter-list.component';

describe('AdminCounterListComponent', () => {
  let component: AdminCounterListComponent;
  let fixture: ComponentFixture<AdminCounterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCounterListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCounterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
