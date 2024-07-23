import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { ResetPasswordComponent } from '../../components/auth/authentification/reset-password/reset-password.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    FooterComponent,
    AuthHeaderComponent,
    ResetPasswordComponent,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
