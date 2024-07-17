import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCorporateLayoutComponent } from './auth-corporate-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AuthCorporateLayoutComponent', () => {
  let component: AuthCorporateLayoutComponent;
  let fixture: ComponentFixture<AuthCorporateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
      imports: [AuthCorporateLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCorporateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
