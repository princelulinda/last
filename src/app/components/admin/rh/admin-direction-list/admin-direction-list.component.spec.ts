import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirectionListComponent } from './admin-direction-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AdminDirectionListComponent', () => {
  let component: AdminDirectionListComponent;
  let fixture: ComponentFixture<AdminDirectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDirectionListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDirectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
