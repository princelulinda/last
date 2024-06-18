import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordFieldComponent } from '../../../global/password-field/password-field.component';

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, PasswordFieldComponent],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent {}
