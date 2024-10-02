import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWalletListComponent } from './client-wallet-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientWalletListComponent', () => {
  let component: ClientWalletListComponent;
  let fixture: ComponentFixture<ClientWalletListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWalletListComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWalletListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
