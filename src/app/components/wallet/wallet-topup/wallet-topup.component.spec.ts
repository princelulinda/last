import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTopupComponent } from './wallet-topup.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WalletTopupComponent', () => {
  let component: WalletTopupComponent;
  let fixture: ComponentFixture<WalletTopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletTopupComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletTopupComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
