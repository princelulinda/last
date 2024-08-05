import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAccountComponent } from './credit-account.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreditAccountComponent', () => {
  let component: CreditAccountComponent;
  let fixture: ComponentFixture<CreditAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditAccountComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
