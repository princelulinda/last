import { Routes } from '@angular/router';

import { AuthSignUpComponent } from './authentification/auth-sign-up/auth-sign-up.component';
import { LandingPageComponent } from './authentification/landing-page/landing-page.component';
import { LoginComponent } from './authentification/login/login.component';
import { ResetPasswordComponent } from './authentification/reset-password/reset-password.component';

export const AuthRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'sign-up', component: AuthSignUpComponent },
];
