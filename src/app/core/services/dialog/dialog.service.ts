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
    response: '',
  });

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

  openDialog(payload: DialogPayloadModel) {
    this.dialog.set({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      action: payload.action,
      active: true,
    });
  }

  dispatchLoading(action: string) {
    this.loading.set({
      action: action,
      active: true,
      type: 'loading',
    });
  }

  setDialogResponse(data: DialogResponseModel) {
    this.response.set(data);
  }

  getDialogState(): Observable<DialogResponseModel> {
    return toObservable(this.response);
  }

  closeToast() {
    this.toast.set({
      active: false,
      message: '',
      title: '',
      type: '',
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
  closeLoading() {
    this.loading.set({
      action: '',
      active: false,
      type: '',
    });
  }
}
