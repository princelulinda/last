import { Component, effect, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Observable } from 'rxjs';

import {
  DialogModel,
  ToastModel,
} from '../../../../core/services/dialog/dialogs-models';
import {
  AuthService,
  DialogService,
  GeneralService,
} from '../../../../core/services';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { PasswordFieldComponent } from '../../custom-field/password-field/password-field.component';
import { DbService } from '../../../../core/db';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordFieldComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements AfterViewInit, OnInit {
  dialog: DialogModel = {
    message: '',
    active: false,
    title: '',
    type: '',
    action: '',
    image: '',
  };
  toast: ToastModel = {
    active: false,
    message: '',
    title: '',
    type: '',
  };
  loading: {
    active: boolean;
    type: 'spinner' | 'topLoader' | '';
    action: string;
  } = {
    action: '',
    active: false,
    type: '',
  };

  private dialogElement!: HTMLDialogElement | null;
  private toastElement!: HTMLElement | null;

  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
  });

  pinForm: FormGroup = this.fb.group({
    pin: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });
  changePinForm = this.fb.group({
    old_pin: ['', Validators.required],
    new_pin: ['', Validators.required],
    new_pin2: ['', Validators.required],
  });
  isCreatingPin = false;

  clientInfo!: UserInfoModel;
  clientInfo$: Observable<UserInfoModel>;

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder,
    private authService: AuthService,
    private generalService: GeneralService,
    private dbService: DbService
  ) {
    this.clientInfo$ = this.authService.getUserInfo();
    effect(() => {
      this.dialog = this.dialogService.dialog();
      if (!this.dialog.image) {
        this.dialog.image = '/images/logo/magis-erp.png';
      }
      this.loading = this.dialogService.loading();

      if (
        this.dialog.active ||
        (this.loading.active && this.loading.type === 'spinner')
      ) {
        if (this.dialogElement) {
          this.dialogElement.showModal();
        }
      } else if (!this.dialog.active) {
        this.dialogElement?.close();
      }
    });

    effect(() => {
      this.toast = this.dialogService.toast();
      if (
        this.toast?.active &&
        (this.toast.type === 'success' ||
          this.toast.type === 'failed' ||
          this.toast.type === 'info')
      ) {
        this.toastElement?.classList.remove('hide');
        this.toastElement?.classList.add('show');
      } else {
        this.toastElement?.classList.remove('add');
        this.toastElement?.classList.add('hide');
      }
    });
  }

  ngOnInit() {
    this.clientInfo$.subscribe({
      next: userInfo => {
        if (userInfo) {
          this.clientInfo = userInfo;
        }
      },
    });
  }

  setConfirmationDialogResponse(payload: 'YES' | 'NO') {
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: {
        confirmation: payload,
        password: '',
        pin: '',
      },
    });
    this.cancelDialog();
  }

  cancelDialog() {
    this.dialogService.closeDialog();
  }

  submitPassword() {
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: {
        password: this.passwordForm.value.password,
        confirmation: '',
        pin: '',
      },
    });
    this.passwordForm.reset();
    this.dialogService.closeDialog();
  }

  submitPin(afterCreate = false) {
    let pin = '';
    if (afterCreate) {
      pin = this.changePinForm.value.new_pin as string;
    } else {
      pin = this.pinForm.value.pin;
    }
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: { pin: pin, confirmation: '', password: '' },
    });
    this.pinForm.reset();
    this.dialogService.closeDialog();
  }
  submitPinCreation() {
    this.isCreatingPin = true;
    this.generalService.changePin(this.changePinForm.value).subscribe({
      next: response_data => {
        this.isCreatingPin = false;
        if (response_data.object.success === true) {
          this.clientInfo.client.has_pin = true;
          this.dbService.setUser(this.clientInfo);
          this.submitPin(true);
        } else if (response_data.object.success === false) {
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: response_data.object.response_message,
          });
        }
      },
      error: err => {
        this.isCreatingPin = false;
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message:
            err?.object?.response_message ??
            'Something went, please retry again!',
        });
      },
    });
  }
  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.toastElement = document.getElementById('alert');
  }
  onPinChange(pin: string) {
    this.pinForm.patchValue({
      pin,
    });
  }
  onPasswordChange(old_pin: string) {
    this.changePinForm.patchValue({
      old_pin,
    });
  }
  newPin = '';
  confirmPin = '';
  arePinsMatch = false;
  onNewPinChange(new_pin: string) {
    this.changePinForm.patchValue({
      new_pin,
    });
    this.newPin = new_pin;
    this.checkPinSimilartiy();
  }
  onConfirmPinChange(new_pin2: string) {
    this.changePinForm.patchValue({
      new_pin2,
    });
    this.confirmPin = new_pin2;
    this.checkPinSimilartiy();
  }
  checkPinSimilartiy() {
    this.arePinsMatch = this.newPin === this.confirmPin;
  }
  handleEnter() {
    if (this.changePinForm.valid && this.arePinsMatch) {
      this.submitPinCreation();
    }
  }
  handleEnter2() {
    if (this.pinForm.valid) {
      this.submitPin();
    }
  }
}
