import { WritableSignal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';

import {
  DialogModel,
  DialogPayloadModel,
  DialogResponseModel,
} from '../dialogs-models';
import { ConfirmDialogComponent } from '../../../global/popups/confirm-dialog/confirm-dialog.component';

export class OpenDialog {
  static dialog: WritableSignal<DialogModel> = signal({
    active: false,
    message: '',
    title: '',
    action: '',
    type: '',
  });

  // private  response: WritableSignal<ResponseModel> = signal({
  //   action: '',
  //   response: '',
  // });

  private response: WritableSignal<DialogResponseModel> = signal({
    action: '',
    response: '',
  });
  response$!: Observable<DialogResponseModel>;

  constructor(payload: DialogPayloadModel) {
    OpenDialog.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action,
      active: true,
    });
  }

  getResponse(): Observable<DialogResponseModel> {
    return toObservable(ConfirmDialogComponent.DialogResponse);
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
