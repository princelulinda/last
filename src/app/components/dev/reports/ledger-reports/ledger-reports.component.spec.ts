import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerReportsComponent } from './ledger-reports.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LedgerReportsComponent', () => {
  let component: LedgerReportsComponent;
  let fixture: ComponentFixture<LedgerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedgerReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LedgerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
