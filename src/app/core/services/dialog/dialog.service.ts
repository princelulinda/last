import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  DialogModel,
  DialogPayloadModel,
  DialogResponseModel,
  ToastModel,
  ToastPaylodModel,
} from './dialogs-models';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  toast: WritableSignal<ToastModel> = signal({
    active: false,
    message: '',
    title: '',
    type: '',
  });

  dialog: WritableSignal<DialogModel> = signal({
    active: false,
    message: '',
    title: '',
    action: '',
    type: '',
  });

  loading: WritableSignal<{
    type: 'loading' | '';
    active: boolean;
    action: string;
  }> = signal({
    action: '',
    type: 'loading',
    active: false,
  });

  response: WritableSignal<DialogResponseModel> = signal({
    action: '',
    response: {
      confirmation: '',
      password: '',
      pin: '',
    },
  });

  splashScreen = signal(false);
  private isShowed = signal(false);

  // Toast Methods
  openToast(payload: ToastPaylodModel) {
    this.toast.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      active: true,
    });

    setTimeout(() => {
      this.closeToast();
    }, 5000);
  }

  closeToast() {
    this.toast.set({
      active: false,
      message: '',
      title: '',
      type: '',
    });
  }

  // Dialogs Methods
  openDialog(payload: DialogPayloadModel) {
    this.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action,
      active: true,
    });
  }
  closeDialog() {
    this.dialog.set({
      active: false,
      message: '',
      title: '',
      type: '',
      action: '',
    });
  }

  // Loading Methods
  dispatchLoading(action?: string) {
    this.loading.set({
      action: action ?? '',
      active: true,
      type: 'loading',
    });
  }
  closeLoading() {
    this.loading.set({
      action: '',
      active: false,
      type: '',
    });
  }

  // Response Methods
  setDialogResponse(data: DialogResponseModel) {
    this.response.set(data);
  }
  getDialogState(): Observable<DialogResponseModel> {
    return toObservable(this.response);
  }

  // Spash screnn Methods
  dispatchSplashScreen() {
    this.splashScreen.set(true);
  }
  closeSplashScreen() {
    this.splashScreen.set(false);
  }

  // Amount Methods
  displayAmount() {
    this.isShowed.set(!this.isShowed());
  }
  getAmountState(): Observable<boolean> {
    return toObservable(this.isShowed);
  }
}
