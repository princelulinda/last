import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsReportsComponent } from './bills-reports.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BillsReportsComponent', () => {
  let component: BillsReportsComponent;
  let fixture: ComponentFixture<BillsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsReportsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BillsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
