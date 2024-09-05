import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirectionListComponent } from './admin-direction-list.component';

describe('AdminDirectionListComponent', () => {
  let component: AdminDirectionListComponent;
  let fixture: ComponentFixture<AdminDirectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirectionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDirectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
