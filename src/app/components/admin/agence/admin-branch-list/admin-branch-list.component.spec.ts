import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBranchListComponent } from './admin-branch-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AdminBranchListComponent', () => {
  let component: AdminBranchListComponent;
  let fixture: ComponentFixture<AdminBranchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBranchListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBranchListComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
