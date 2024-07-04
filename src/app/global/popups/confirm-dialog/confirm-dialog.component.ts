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
} from '../../../core/services/dialog/dialogs-models';
import { AuthService, DialogService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  };
  toast: ToastModel = {
    active: false,
    message: '',
    title: '',
    type: '',
  };
  loading: { active: boolean; type: 'loading' | ''; action: string } = {
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
    private authService: AuthService
  ) {
    this.clientInfo$ = this.authService.getUserInfo();
    effect(() => {
      this.dialog = this.dialogService.dialog();
      this.loading = this.dialogService.loading();

      if (this.dialog.active || this.loading.active) {
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
        this.clientInfo = userInfo;
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
  submitPin() {
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: { pin: this.pinForm.value.pin, confirmation: '', password: '' },
    });
    this.pinForm.reset();
    this.dialogService.closeDialog();
  }

  // submitPinCreation() {
  //   this.isCreatingPin = true;
  //   this.settingService.changePin(this.changePinForm.value).subscribe({
  //     next: response_data => {
  //       this.isCreatingPin = false;
  //       if (response_data.object.success === true) {
  //         this.variableService.pin = this.changePinForm.value['new_pin'];
  //         this.store.dispatch(new CloseDialog({ response: 'pin submitted' }));
  //         this.store.dispatch(new ConfirmPinPossession());
  //       } else if (response_data.object.success === false) {
  //         const data = {
  //           title: '',
  //           type: 'failed',
  //           message: response_data.object.response_message,
  //         };
  //         this.store.dispatch(new OpenDialog(data));
  //       }
  //     },
  //     error: (err: any) => {
  //       this.isCreatingPin = false;
  //       const data = {
  //         title: '',
  //         type: 'failed',
  //         message: 'Something went, please retry again!',
  //       };
  //       this.store.dispatch(new OpenDialog(data));
  //     },
  //   });
  // }

  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.toastElement = document.getElementById('alert');
  }
}
