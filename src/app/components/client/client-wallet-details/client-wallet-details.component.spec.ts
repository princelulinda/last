import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWalletDetailsComponent } from './client-wallet-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientWalletDetailsComponent', () => {
  let component: ClientWalletDetailsComponent;
  let fixture: ComponentFixture<ClientWalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWalletDetailsComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWalletDetailsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
