import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferReportsComponent } from './transfer-reports.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BillsReportsComponent', () => {
  let component: TransferReportsComponent;
  let fixture: ComponentFixture<TransferReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
