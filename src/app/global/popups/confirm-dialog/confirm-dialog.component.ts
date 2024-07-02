import { Component, effect, AfterViewInit } from '@angular/core';
import { OpenDialog } from '../../../core/popups/dialogs/open-dialog';
import { CommonModule } from '@angular/common';
import { DialogModel } from '../../../core/popups/dialogs-models';

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
  dialogElement!: HTMLDialogElement | null;
  alertElement!: HTMLElement | null;

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
        this.dialog?.active &&
        (this.dialog.type === 'success' ||
          this.dialog.type === 'failed' ||
          this.dialog.type === 'info')
      ) {
        this.alertElement?.classList.remove('hide');
        this.alertElement?.classList.add('show');
      } else {
        this.alertElement?.classList.remove('add');
        this.alertElement?.classList.add('hide');
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
    this.alertElement = document.getElementById('alert');
  }
}
