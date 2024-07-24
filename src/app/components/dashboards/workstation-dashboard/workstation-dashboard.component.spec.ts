import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationDashboardComponent } from './workstation-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WorkstationDashboardComponent', () => {
  let component: WorkstationDashboardComponent;
  let fixture: ComponentFixture<WorkstationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationDashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
