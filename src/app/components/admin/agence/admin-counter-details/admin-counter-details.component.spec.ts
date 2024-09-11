import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCounterDetailsComponent } from './admin-counter-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminCounterDetailsComponent', () => {
  let component: AdminCounterDetailsComponent;
  let fixture: ComponentFixture<AdminCounterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCounterDetailsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCounterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
