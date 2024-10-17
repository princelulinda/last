import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbankedWalletComponent } from './unbanked-wallet.component';

describe('UnbankedWalletComponent', () => {
  let component: UnbankedWalletComponent;
  let fixture: ComponentFixture<UnbankedWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnbankedWalletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnbankedWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
