import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletDetailsComponent } from './wallet-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WalletDetailsComponent', () => {
  let component: WalletDetailsComponent;
  let fixture: ComponentFixture<WalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletDetailsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
