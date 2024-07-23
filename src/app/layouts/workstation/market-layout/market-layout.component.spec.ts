import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketLayoutComponent } from './market-layout.component';

describe('MarketLayoutComponent', () => {
  let component: MarketLayoutComponent;
  let fixture: ComponentFixture<MarketLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
