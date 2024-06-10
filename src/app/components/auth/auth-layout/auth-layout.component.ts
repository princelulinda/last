import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { LeftAsideMenuComponent } from '../../../shared/aside-menu/left-aside-menu/left-aside-menu.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, LeftAsideMenuComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
