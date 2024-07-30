import { Injectable, WritableSignal, signal } from '@angular/core';
import {
  DialogModel,
  DialogPayloadModel,
  DialogResponseModel,
  ToastModel,
  ToastPaylodModel,
  MerchantBillModel,
  TransfertBillModel,
  LandscpeBillModel,
  ObrBillModel,
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
    image: '',
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

  merchantBill!: WritableSignal<{
    active: boolean;
    payload: MerchantBillModel | null;
  }>;
  landscapeBill!: WritableSignal<{
    active: boolean;
    payload: LandscpeBillModel | null;
  }>;
  transferBill!: WritableSignal<{
    active: boolean;
    payload: TransfertBillModel | null;
  }>;
  obrBill!: WritableSignal<{
    active: boolean;
    payload: ObrBillModel | null;
  }>;

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
      image: payload.image ?? '',
    });
  }
  closeDialog() {
    this.dialog.set({
      active: false,
      message: '',
      title: '',
      type: '',
      action: '',
      image: '',
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
    if (!this.dialog().active) {
      this.setDialogResponse({
        action: '',
        response: { confirmation: '', password: '', pin: '' },
      });
    }
    return toObservable(this.response);
  }

  // Spash screnn Methods
  dispatchSplashScreen() {
    this.splashScreen.set(true);
  }
  closeSplashScreen() {
    setTimeout(() => {
      this.splashScreen.set(false);
    }, 2000);
  }

  // Amount Methods
  displayAmount() {
    this.isShowed.set(!this.isShowed());
  }
  getAmountState(): Observable<boolean> {
    return toObservable(this.isShowed);
  }

  // Bills format Dispatcher
  OpenTransfertBillPopup(payload: TransfertBillModel) {
    this.transferBill.set({
      active: true,
      payload: payload,
    });
  }
  OpenMerchantBillPopup(payload: MerchantBillModel) {
    this.merchantBill.set({
      active: true,
      payload: payload,
    });
  }

  OpenObrBillPopup(payload: ObrBillModel) {
    this.obrBill.set({
      active: true,
      payload: payload,
    });
  }
  OpenLandscapeBillPopup(payload: LandscpeBillModel) {
    this.landscapeBill.set({
      active: true,
      payload: payload,
    });
  }
  closeBillDialog() {
    this.transferBill.set({
      active: false,
      payload: null,
    });
    this.merchantBill.set({
      active: false,
      payload: null,
    });
    this.obrBill.set({
      active: false,
      payload: null,
    });
    this.landscapeBill.set({
      active: false,
      payload: null,
    });
  }
}
