import { signal } from '@angular/core';

export class OpenToast {
  static dialog = signal({
    active: false,
    message: '',
    title: '',
    type: '',
  });

  constructor(payload: { message: string; title: string; type: string }) {
    OpenToast.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      active: true,
    });

    setTimeout(() => {
      OpenToast.closeDialog();
    }, 5000);
  }

  static closeDialog() {
    OpenToast.dialog.set({
      active: false,
      message: '',
      title: '',
      type: '',
    });
  }
}
