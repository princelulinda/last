import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListWsComponent } from './wallet-list-ws.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('WalletListWsComponent', () => {
  let component: WalletListWsComponent;
  let fixture: ComponentFixture<WalletListWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletListWsComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletListWsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
