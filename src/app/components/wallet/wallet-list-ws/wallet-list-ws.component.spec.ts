import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletListWsComponent } from './wallet-list-ws.component';

describe('WalletListWsComponent', () => {
  let component: WalletListWsComponent;
  let fixture: ComponentFixture<WalletListWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletListWsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletListWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
