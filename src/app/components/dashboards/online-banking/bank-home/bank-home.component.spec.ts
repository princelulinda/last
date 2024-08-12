import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankHomeComponent } from './bank-home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('BankHomeComponent', () => {
  let component: BankHomeComponent;
  let fixture: ComponentFixture<BankHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHomeComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHomeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
