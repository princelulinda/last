import { WritableSignal } from '@angular/core';
import { ToastModel, dialogTypeModel } from './dialog-models';

export class OpenDialog {
  static payload: WritableSignal<ToastModel>;

  constructor(payload: {
    title: string;
    message: string;
    type: dialogTypeModel;
  }) {
    OpenDialog.payload.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      active: true,
    });
    OpenDialog.closeDialog();
  }

  static closeDialog() {
    setTimeout(() => {
      OpenDialog.payload.set({
        active: false,
        message: '',
        title: '',
        type: '',
      });
    }, 5000);
  }
}
