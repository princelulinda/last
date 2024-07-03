import {
  Component,
  effect,
  AfterViewInit,
  WritableSignal,
  signal,
} from '@angular/core';
import { OpenDialog } from '../../../core/popups/dialogs/open-dialog';
import { CommonModule } from '@angular/common';
import {
  DialogModel,
  DialogResponseModel,
  ToastModel,
} from '../../../core/popups/dialogs-models';
import { OpenToast } from '../../../core/popups/toast/open-toast';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
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

  static DialogResponse: WritableSignal<DialogResponseModel> = signal({
    action: '',
    response: '',
  });

  private dialogElement!: HTMLDialogElement | null;
  private toastElement!: HTMLElement | null;

  constructor() {
    effect(() => {
      this.dialog = OpenDialog.dialog();

      if (
        this.dialog.active &&
        (this.dialog.type === 'confirm' ||
          this.dialog.type === 'password' ||
          this.dialog.type === 'pin')
      ) {
        if (this.dialogElement && this.dialog.active) {
          this.dialogElement.showModal();
        }
      } else {
        if (this.dialogElement) {
          this.dialogElement.close();
        }
      }
    });

    effect(() => {
      this.toast = OpenToast.toast();
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

  closeDialog() {
    OpenDialog.closeDialog();
  }

  getDialogResponse(response?: string) {
    if (response) {
      ConfirmDialogComponent.DialogResponse.set({
        response: response,
        action: this.dialog.action,
      });
    }
    this.closeDialog();
  }

  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.toastElement = document.getElementById('alert');
  }
}
