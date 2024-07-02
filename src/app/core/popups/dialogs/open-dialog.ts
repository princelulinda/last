import { WritableSignal, signal } from '@angular/core';
import {
  DialogModel,
  DialogPayloadModel,
  ResponseModel,
} from '../dialogs-models';
// import { ConfirmDialogComponent } from '../../../global/popups/confirm-dialog/confirm-dialog.component';

export class OpenDialog {
  static dialog: WritableSignal<DialogModel> = signal({
    active: false,
    message: '',
    title: '',
    action: '',
    type: '',
  });

  private static response: WritableSignal<ResponseModel> = signal({
    action: '',
    response: '',
  });

  constructor(payload: DialogPayloadModel) {
    OpenDialog.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action,
      active: true,
    });

    // effect(() => {
    //  OpenDialog.
    // });
  }

  static getResponse(): ResponseModel {
    return OpenDialog.response();
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
