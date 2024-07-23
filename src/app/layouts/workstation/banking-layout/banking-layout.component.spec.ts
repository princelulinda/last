import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingLayoutComponent } from './banking-layout.component';

describe('BankingLayoutComponent', () => {
  let component: BankingLayoutComponent;
  let fixture: ComponentFixture<BankingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
