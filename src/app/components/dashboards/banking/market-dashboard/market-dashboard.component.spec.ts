import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDashboardComponent } from './market-dashboard.component';
import { provideHttpClient } from '@angular/common/http';

describe('MarketDashboardComponent', () => {
  let component: MarketDashboardComponent;
  let fixture: ComponentFixture<MarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketDashboardComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
