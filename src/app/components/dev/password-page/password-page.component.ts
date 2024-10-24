import { Component } from '@angular/core';
import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';

@Component({
  selector: 'app-password-page',
  standalone: true,
  imports: [PasswordFieldComponent],
  templateUrl: './password-page.component.html',
  styleUrl: './password-page.component.scss',
})
export class PasswordPageComponent {}
