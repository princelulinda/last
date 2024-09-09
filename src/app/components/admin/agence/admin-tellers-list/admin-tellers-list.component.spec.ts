import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTellersListComponent } from './admin-tellers-list.component';

describe('AdminTellersListComponent', () => {
  let component: AdminTellersListComponent;
  let fixture: ComponentFixture<AdminTellersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTellersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTellersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
