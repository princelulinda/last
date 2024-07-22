import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchBankComponent } from './switch-bank.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SwitchBankComponent', () => {
  let component: SwitchBankComponent;
  let fixture: ComponentFixture<SwitchBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchBankComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
