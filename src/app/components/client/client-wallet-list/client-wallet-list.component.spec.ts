import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWalletListComponent } from './client-wallet-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ClientWalletListComponent', () => {
  let component: ClientWalletListComponent;
  let fixture: ComponentFixture<ClientWalletListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      imports: [ClientWalletListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWalletListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
