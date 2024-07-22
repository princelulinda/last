import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService, DialogService } from '../../../../core/services';
import {
  resetPasswordResponse,
  otpVerificationResponse,
} from '../../auth.model';
import { PasswordFieldComponent } from '../../../../global/components/custom-field/password-field/password-field.component';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    PasswordFieldComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  step = 1;
  submitted = false;
  isLoadingOTP = false;
  arePasswordsMatch = false;
  isLoadingVerificationOTP = false;
  dialog$: Observable<DialogResponseModel>;
  submit() {
    this.submitted = true;
    if (this.stepResetPassword.controls.clientEmail.invalid && this.step == 1) {
      return;
    }
    this.step = this.step + 1;
    if (this.step == 3) {
      this.route.navigate(['']);
    }
  }
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }
  previous() {
    this.step = this.step - 1;
  }

  stepResetPassword = this.fb.group({
    clientEmail: this.fb.group({
      email: ['', Validators.required],
    }),
    changePassword: this.fb.group({
      otp: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }),
  });

  verifyType() {
    //   const otpValue =
    //       this.stepResetPassword.controls.clientEmail.value.email;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      this.stepResetPassword.controls.clientEmail.value.email?.match(emailRegex)
    ) {
      return 'email';
    } else {
      return 'phone_number';
    }
  }

  requestOTP() {
    this.isLoadingOTP = true;
    const otpValue = this.stepResetPassword.controls.clientEmail.value.email;
    const otpType = this.verifyType();
    const data = {
      otp_value: otpValue,
      otp_type: otpType,
      otp_menu: 'password_reset',
    };

    this.authService.requestOTP(data).subscribe({
      next: (response: resetPasswordResponse) => {
        this.isLoadingOTP = false;
        if (response.object.success === true) {
          this.step = this.step = 2;
        }
      },
      error: error => {
        console.log('errrsssss', error);
        this.isLoadingOTP = false;
        //   const data = {
        //       title: '',
        //       type: 'failed',
        //       message: 'Something went wrong, please retry again!',
        //   };
        //   // this.store.dispatch(new OpenDialog(data));
      },
    });
  }
  OTPverification() {
    this.isLoadingVerificationOTP = true;
    const otpType = this.verifyType();
    const data = {
      otp_menu: 'password_reset',
      otp_type: otpType,
      otp_data: {
        code: this.stepResetPassword.controls.changePassword.value.otp,
        newPassword:
          this.stepResetPassword.controls.changePassword.value.newPassword,
        confirnPassword:
          this.stepResetPassword.controls.changePassword.value.confirmPassword,
      },
    };
    this.dialogService.dispatchLoading();
    this.authService.OTPverification(data).subscribe({
      next: (response: otpVerificationResponse) => {
        this.isLoadingVerificationOTP = false;
        this.dialogService.closeLoading();
        if (response.object.success === true) {
          this.route.navigate(['/login/']);
        } else {
          //   const data = {
          //       title: '',
          //       type: 'failed',
          //       message: 'Could not find the OTP to validate',
          //   };
          // this.store.dispatch(new OpenDialog(data));
        }
      },
      error: error => {
        console.log('error', error);
        this.isLoadingVerificationOTP = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message: 'an error has occured!',
        });
      },
    });
  }

  onPasswordChange(newPassword: string) {
    this.stepResetPassword.controls.changePassword.patchValue({
      newPassword,
    });
  }

  checkPasswordSimilarity() {
    if (
      this.stepResetPassword.controls.changePassword.value.newPassword !==
      this.stepResetPassword.controls.changePassword.value.confirmPassword
    ) {
      this.arePasswordsMatch = false;
    } else {
      this.arePasswordsMatch = true;
    }
  }
}
