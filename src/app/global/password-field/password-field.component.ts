import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() labelPass: boolean | undefined;
  @Input() labelPin: boolean | undefined;
  @Input() required: boolean | undefined;
  @Input() labelIcon: boolean | undefined;
  @Output() passwordValid = new EventEmitter<string>();
  @Output() pinValid = new EventEmitter<string>();

  passwordForm: FormGroup;
  showPassword = false;
  passwordType = 'password';

  constructor() {
    this.passwordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[0-9])'),
        Validators.pattern('^(?=.*[A-Z])$'),
        Validators.pattern('^(?=.*[$@$!%*?&])$'),
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
        if (key === 'required') {
          errors.push('Password is required');
        } else if (key === 'minlength') {
          errors.push('8 Characters minimun');
        } else if (key === 'pattern') {
          const passwordErrors = [];
          if (!this.hasDigit(passwordControl.value)) {
            passwordErrors.push('Must contain number');
          }
          if (!this.hasUppercase(passwordControl.value)) {
            passwordErrors.push('Must contain uppercase');
          }
          if (!this.hasSpecialChar(passwordControl.value)) {
            passwordErrors.push('Must contain spacial characters (!@$%');
          }
          errors.push(...passwordErrors);
        }
      }
    }
    return errors;
  }

  hasDigit(password: string): boolean {
    return /\d/.test(password);
  }

  hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  hasSpecialChar(password: string): boolean {
    return /[$@$!%*?&]/.test(password);
  }

  onSubmitPassword() {
    if (
      !this.getPasswordErrors().includes('8 Characters minimun') &&
      !this.getPasswordErrors().includes('Must contain number') &&
      !this.getPasswordErrors().includes('Password is required') &&
      !this.getPasswordErrors().includes('Must contain uppercase') &&
      !this.getPasswordErrors().includes(
        'Must contain spacial characters (!@$%'
      )
    ) {
      const password = this.passwordForm.value.password;
      this.passwordValid.emit(password);
      console.log(password);
    }
  }
  onSubmitPin() {
    if (!this.getPasswordErrors().includes(' Characters minimun')) {
      const pin = this.passwordForm.value.password;
      this.pinValid.emit(pin);
      console.log(pin);
    }
  }
}
