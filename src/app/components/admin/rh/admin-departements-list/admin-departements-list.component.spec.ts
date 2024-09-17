import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDepartementsListComponent } from './admin-departements-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AdminDepartementsListComponent', () => {
  let component: AdminDepartementsListComponent;
  let fixture: ComponentFixture<AdminDepartementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDepartementsListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDepartementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
