import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTellersDetailsComponent } from './admin-tellers-details.component';

describe('AdminTellersDetailsComponent', () => {
  let component: AdminTellersDetailsComponent;
  let fixture: ComponentFixture<AdminTellersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTellersDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTellersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
