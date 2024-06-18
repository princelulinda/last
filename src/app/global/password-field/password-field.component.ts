import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.scss',
})
export class PasswordFieldComponent {
  @Input() Validator: boolean | undefined;
  @Input() weak: boolean | undefined;

  passwordForm: FormGroup;
  showPassword = false;
  passwordType = 'password';

  constructor() {
    this.passwordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z$@$!%*?&].{8,}'
        ),
      ]),
    });
  }

  changePasswordType() {
    if (!this.showPassword) {
      this.showPassword = true;
      this.passwordType = 'text';
    } else {
      this.showPassword = false;
      this.passwordType = 'password';
    }
  }

  get passwordFormField() {
    return this.passwordForm.get('password');
  }

  getPasswordErrors() {
    const passwordControl = this.passwordFormField;
    const errors = [];
    if (passwordControl && passwordControl.errors) {
      for (const key of Object.keys(passwordControl.errors)) {
        // Customize error messages based on validation error keys
        if (key === 'required') {
          errors.push('Password is required');
        } else if (key === 'minlength') {
          errors.push('8 Characters minimun');
        } else if (key === 'pattern') {
          errors.push('Must contain number');
          errors.push('Must contain uppercase');
          errors.push('Must contain spacial characters (!@$%');
        }
      }
    }
    return errors;
  }
}
