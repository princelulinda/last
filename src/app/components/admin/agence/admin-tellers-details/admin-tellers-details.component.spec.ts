import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTellersDetailsComponent } from './admin-tellers-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('AdminTellersDetailsComponent', () => {
  let component: AdminTellersDetailsComponent;
  let fixture: ComponentFixture<AdminTellersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTellersDetailsComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTellersDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
