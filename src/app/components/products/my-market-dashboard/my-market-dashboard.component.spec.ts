import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMarketDashboardComponent } from './my-market-dashboard.component';

describe('MyMarketDashboardComponent', () => {
  let component: MyMarketDashboardComponent;
  let fixture: ComponentFixture<MyMarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyMarketDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyMarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
