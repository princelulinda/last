import { Component } from '@angular/core';
import { LeftAsideMenuComponent } from '../../../shared/aside-menu/left-aside-menu/left-aside-menu.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  imports: [LeftAsideMenuComponent],
})
export class AuthLayoutComponent {}
