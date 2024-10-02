import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWalletDetailsComponent } from './client-wallet-details.component';

describe('ClientWalletDetailsComponent', () => {
  let component: ClientWalletDetailsComponent;
  let fixture: ComponentFixture<ClientWalletDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientWalletDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientWalletDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
