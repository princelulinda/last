import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTreasureDetailsComponent } from './admin-treasure-details.component';

describe('AdminTreasureDetailsComponent', () => {
  let component: AdminTreasureDetailsComponent;
  let fixture: ComponentFixture<AdminTreasureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTreasureDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTreasureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
