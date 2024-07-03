import { Component, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DialogModel,
  ToastModel,
} from '../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../core/services';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements AfterViewInit {
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
  private dialogElement!: HTMLDialogElement | null;
  private toastElement!: HTMLElement | null;

  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
  });

  pinForm = this.fb.group({
    pin: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  constructor(
    private dialogService: DialogService,
    private fb: FormBuilder
  ) {
    effect(() => {
      this.dialog = this.dialogService.dialog();

      if (
        this.dialog.active &&
        (this.dialog.type === 'confirm' ||
          this.dialog.type === 'password' ||
          this.dialog.type === 'pin')
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

  setConfirmationDialogResponse(payload: 'YES' | 'NO') {
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: payload,
    });
  }

  submitPassword() {
    this.dialogService.setDialogResponse({
      action: this.dialog.action,
      response: { password: this.passwordForm.value },
    });
    this.passwordForm.reset();
    this.dialogService.closeDialog();
  }

  cancelDialog() {
    this.dialogService.closeDialog();
  }

  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.toastElement = document.getElementById('alert');
  }
}
