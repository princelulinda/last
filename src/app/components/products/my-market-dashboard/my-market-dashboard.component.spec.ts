import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMarketDashboardComponent } from './my-market-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('MyMarketDashboardComponent', () => {
  let component: MyMarketDashboardComponent;
  let fixture: ComponentFixture<MyMarketDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
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
