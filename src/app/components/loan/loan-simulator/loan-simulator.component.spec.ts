import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSimulatorComponent } from './loan-simulator.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoanSimulatorComponent', () => {
  let component: LoanSimulatorComponent;
  let fixture: ComponentFixture<LoanSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSimulatorComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
