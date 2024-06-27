import { Component, effect, AfterViewInit } from '@angular/core';
import { OpenDialog } from '../../../core/popups/dialogs/open-dialog';
import { CommonModule } from '@angular/common';
import { ToastModel } from '../../../core/popups/dialogs/dialog-models';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent implements AfterViewInit {
  dialog: ToastModel = {
    message: '',
    active: false,
    title: '',
    type: '',
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
        } else if (this.dialogElement && !this.dialog.active) {
          this.dialogElement.close();
        }
      } else if (
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

  ngAfterViewInit() {
    this.dialogElement =
      (document.getElementById('favDialog') as HTMLDialogElement) ?? null;
    this.alertElement = document.getElementById('alert');
  }
}
