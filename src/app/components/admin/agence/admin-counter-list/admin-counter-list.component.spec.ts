import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCounterListComponent } from './admin-counter-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AdminCounterListComponent', () => {
  let component: AdminCounterListComponent;
  let fixture: ComponentFixture<AdminCounterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCounterListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCounterListComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
