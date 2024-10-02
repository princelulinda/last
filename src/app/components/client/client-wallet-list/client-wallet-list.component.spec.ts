import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientWalletListComponent } from './client-wallet-list.component';

describe('ClientWalletListComponent', () => {
  let component: ClientWalletListComponent;
  let fixture: ComponentFixture<ClientWalletListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
