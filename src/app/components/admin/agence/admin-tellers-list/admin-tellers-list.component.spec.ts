import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTellersListComponent } from './admin-tellers-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminTellersListComponent', () => {
  let component: AdminTellersListComponent;
  let fixture: ComponentFixture<AdminTellersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTellersListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTellersListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
