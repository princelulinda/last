import { WritableSignal, signal } from '@angular/core';
import { ToastModel, ToastPaylodModel } from '../dialogs-models';

export class OpenToast {
  static toast: WritableSignal<ToastModel> = signal({
    active: false,
    message: '',
    title: '',
    type: '',
  });

  constructor(payload: ToastPaylodModel) {
    OpenToast.toast.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      active: true,
    });

    // setTimeout(() => {
    //   OpenToast.closeDialog();
    // }, 5000);
  }

  static closeDialog() {
    OpenToast.toast.set({
      active: false,
      message: '',
      title: '',
      type: '',
    });
  }
}
