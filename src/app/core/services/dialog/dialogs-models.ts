// Toasts Models
export interface ToastModel {
  active: boolean;
  message: string;
  title: string;
  type: toastTypeModel | '';
}

export interface ToastPaylodModel {
  message: string;
  title: string;
  type: toastTypeModel;
}
export type toastTypeModel = 'success' | 'failed' | 'info';

// Dialogs Models
export interface DialogModel {
  title: string;
  message: string;
  type: dialogTypeModel | '';
  action: string;
  active: boolean;
}

export interface DialogPayloadModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
}

export type dialogTypeModel = 'confirm' | 'password' | 'pin';

export interface CloseDialog {
  response: string;
}

export interface DialogResponseModel {
  // response: string | { password: string } | { pin: string };
  response: {
    confirmation: 'YES' | 'NO' | '';
    password: string;
    pin: string;
  };
  action: string;
}
