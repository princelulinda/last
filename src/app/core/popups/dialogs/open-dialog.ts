import { WritableSignal, signal } from '@angular/core';
import {
  DialogModel,
  DialogPayloadModel,
  ResponseModel,
} from '../dialogs-models';
// import { ConfirmDialogComponent } from '../../../global/popups/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
// import { toObservable } from '@angular/core/rxjs-interop';
// import { ConfirmDialogComponent } from '../../../global/popups/confirm-dialog/confirm-dialog.component';

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

  response: WritableSignal<ResponseModel> = signal({
    action: '',
    response: '',
  });
  response$!: Observable<ResponseModel>;

  constructor(payload: DialogPayloadModel) {
    OpenDialog.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action,
      active: true,
    });
    // this.response$ = toObservable(ConfirmDialogComponent.DialogResponse);
  }

  getResponse(): Observable<ResponseModel> {
    return this.response$;
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
