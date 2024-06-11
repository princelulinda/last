import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';

export const routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
];
