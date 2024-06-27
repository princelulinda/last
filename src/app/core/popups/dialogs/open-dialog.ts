import { WritableSignal, signal } from '@angular/core';
import { DialogModel, dialogTypeModel } from './dialog-models';

interface DialogPayloadModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action?: '';
}

// interface ActionPayloadModel {
//   title: string;
//   message: string;
//   type: dialogTypeModel;
//   action: string;
// }

export class OpenDialog {
  static dialog: WritableSignal<DialogModel> = signal({
    active: false,
    message: '',
    title: '',
    action: '',
    type: '',
  });

  constructor(payload: DialogPayloadModel) {
    OpenDialog.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action ?? '',
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
        action: '',
      });
    }, 5000);
  }
}
