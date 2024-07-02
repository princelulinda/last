import { Component, effect, AfterViewInit } from '@angular/core';
import { OpenDialog } from '../../../core/popups/dialogs/open-dialog';
import { CommonModule } from '@angular/common';
import { DialogModel, ToastModel } from '../../../core/popups/dialogs-models';

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

  private dialogElement!: HTMLDialogElement | null;
  private toastElement!: HTMLElement | null;

  constructor() {
    effect(() => {
      // if (OpenDialog.dialog as WritableSignal<ToastModel>) {
      this.dialog = OpenDialog.dialog();
      // } else if (OpenDialog.dialog as WritableSignal<ActionDialogModel>) {
      //   this.dialog = OpenDialog.dialog() as ActionDialogModel;
      // }

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
      console.log('DIALOG INFORMATION', this.dialog);
    });
  }

  closeDialog() {
    OpenDialog.closeDialog();
  }

  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.toastElement = document.getElementById('alert');
  }
}
