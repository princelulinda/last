import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountsDetailComponent } from './client-accounts-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ClientAccountsDetailComponent', () => {
  let component: ClientAccountsDetailComponent;
  let fixture: ComponentFixture<ClientAccountsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [ClientAccountsDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAccountsDetailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
