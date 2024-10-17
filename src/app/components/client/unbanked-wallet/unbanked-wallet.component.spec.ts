import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnbankedWalletComponent } from './unbanked-wallet.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UnbankedWalletComponent', () => {
  let component: UnbankedWalletComponent;
  let fixture: ComponentFixture<UnbankedWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnbankedWalletComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UnbankedWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
