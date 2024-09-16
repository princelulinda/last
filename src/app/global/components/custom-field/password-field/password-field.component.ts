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
  @Input() labelPassword: boolean | undefined;
  @Input() labelPin: boolean | undefined;
  @Input() required: boolean | undefined;
  @Input() labelIcon: boolean | undefined;
  @Input() pin: boolean | undefined;
  @Input() labelPinConfirm: boolean | undefined;
  @Input() password: boolean | undefined;
  @Input() labelPassword2: boolean | undefined;
  @Output() passwordValid = new EventEmitter<string>();
  @Output() pinValid = new EventEmitter<string>();

  @Input() useValidation: boolean | undefined;

  passwordForm: FormGroup;
  showPassword = false;
  passwordType = 'password';

  constructor() {
    this.passwordForm = new FormGroup({
      pin: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        Validators.pattern('^[0-9]*$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('(?=.*[0-9])'),
        Validators.pattern('^(?=.*[A-Z])$'),
        Validators.pattern('^(?=.*[$@#$!%*?&=./(){}+.,-])$'),
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
  get pinFormField() {
    return this.passwordForm.get('pin');
  }
  validateInput(event: KeyboardEvent) {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Tab',
    ];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onSubmitPin() {
    if (
      !this.getPinErrors().includes('Must contain number') &&
      !this.getPinErrors().includes('4 Characters minimun') &&
      !this.getPinErrors().includes('4 Characters maximum')
    ) {
      const pin = this.passwordForm.value.pin;
      this.pinValid.emit(pin);
      // console.log(pin);
    }
  }
  getPinErrors() {
    const passwordControl = this.pinFormField;
    const errors = [];
    if (passwordControl && passwordControl.errors) {
      for (const key of Object.keys(passwordControl.errors)) {
        if (key === 'required') {
          errors.push('Password is required');
        } else if (key === 'minlength') {
          errors.push('4 Characters minimun');
        } else if (key === 'maxlength') {
          errors.push('4 Characters maximum');
        } else if (key === 'pattern') {
          const passwordErrors = [];
          if (!this.hasDigit(passwordControl.value)) {
            passwordErrors.push('Must contain number');
          }
          errors.push(...passwordErrors);
        }
      }
    }
    return errors;
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
    return /[$@#$!%*?&=./(){}+.,-]/.test(password);
  }
  onSubmitPassword() {
    if (this.useValidation) {
      const password = this.passwordForm.value.password;
      this.passwordValid.emit(password);
    } else if (
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
      // console.log(password);
    }
  }
}
