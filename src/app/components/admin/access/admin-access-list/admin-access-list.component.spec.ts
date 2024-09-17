import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessListComponent } from './admin-access-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('AdminAccessListComponent', () => {
  let component: AdminAccessListComponent;
  let fixture: ComponentFixture<AdminAccessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccessListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
