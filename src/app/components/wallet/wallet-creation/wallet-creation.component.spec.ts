import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletCreationComponent } from './wallet-creation.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WalletCreationComponent', () => {
  let component: WalletCreationComponent;
  let fixture: ComponentFixture<WalletCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletCreationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
