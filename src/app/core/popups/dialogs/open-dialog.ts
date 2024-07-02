import { WritableSignal, signal } from '@angular/core';
import { DialogModel, DialogPayloadModel } from '../dialogs-models';

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
  }

  static closeDialog() {
    OpenDialog.dialog.set({
      active: false,
      message: '',
      title: '',
      type: '',
      action: '',
    });
  }
}
