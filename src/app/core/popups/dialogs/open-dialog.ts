import { WritableSignal, signal } from '@angular/core';
import { ToastModel, dialogTypeModel } from './dialog-models';

interface ToastPayloadModel {
  title: string;
  message: string;
  type: dialogTypeModel;
}

// interface ActionPayloadModel {
//   title: string;
//   message: string;
//   type: dialogTypeModel;
//   action: string;
// }

export class OpenDialog {
  static dialog: WritableSignal<ToastModel> = signal({
    active: false,
    message: '',
    title: '',
    type: '',
  });

  constructor(payload: ToastPayloadModel) {
    OpenDialog.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      active: true,
    });
    // if (payload as ToastPayloadModel) {
    //   alert('PUTAIN CA PEUT MARCHE TOAST PAYLOAD');
    // } else if (payload as ActionPayloadModel) {
    //   alert('PUTAIN CA PEUT MARCHE Action PAYLOAD');
    // }
    OpenDialog.closeDialog();
  }

  static closeDialog() {
    setTimeout(() => {
      OpenDialog.dialog.set({
        active: false,
        message: '',
        title: '',
        type: '',
      });
    }, 5000);
  }
}
