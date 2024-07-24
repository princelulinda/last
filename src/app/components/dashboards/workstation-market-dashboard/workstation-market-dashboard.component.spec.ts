import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationMarketDashboardComponent } from './workstation-market-dashboard.component';

describe('WorkstationMarketDashboardComponent', () => {
  let component: WorkstationMarketDashboardComponent;
  let fixture: ComponentFixture<WorkstationMarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationMarketDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationMarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
