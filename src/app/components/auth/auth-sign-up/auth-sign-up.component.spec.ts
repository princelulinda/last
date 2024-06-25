import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSignUpComponent } from './auth-sign-up.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from '../auth.routes';

describe('AuthSignUpComponent', () => {
  let component: AuthSignUpComponent;
  let fixture: ComponentFixture<AuthSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSignUpComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RouterModule.forRoot(AuthRoutes),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
