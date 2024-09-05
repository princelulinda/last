import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirectionDetailsComponent } from './admin-direction-details.component';

describe('AdminDirectionDetailsComponent', () => {
  let component: AdminDirectionDetailsComponent;
  let fixture: ComponentFixture<AdminDirectionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirectionDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDirectionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
