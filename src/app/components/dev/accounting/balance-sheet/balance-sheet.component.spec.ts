import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetComponent } from './balance-sheet.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BalanceSheetComponent', () => {
  let component: BalanceSheetComponent;
  let fixture: ComponentFixture<BalanceSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceSheetComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
