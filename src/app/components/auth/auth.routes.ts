import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';

export const routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
];
