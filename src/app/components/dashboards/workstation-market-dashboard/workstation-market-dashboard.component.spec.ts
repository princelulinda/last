import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationMarketDashboardComponent } from './workstation-market-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WorkstationMarketDashboardComponent', () => {
  let component: WorkstationMarketDashboardComponent;
  let fixture: ComponentFixture<WorkstationMarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationMarketDashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationMarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
