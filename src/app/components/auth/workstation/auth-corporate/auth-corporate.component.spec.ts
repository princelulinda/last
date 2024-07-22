import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCorporateComponent } from './auth-corporate.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthCorporateComponent', () => {
  let component: AuthCorporateComponent;
  let fixture: ComponentFixture<AuthCorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCorporateComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
