import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLayoutComponent } from './market-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('MarketLayoutComponent', () => {
  let component: MarketLayoutComponent;
  let fixture: ComponentFixture<MarketLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketLayoutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
