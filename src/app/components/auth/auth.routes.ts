import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AuthRoutes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetPasswordComponent },
      { path: 'sign-up', component: AuthSignUpComponent },
    ],
  },
];
