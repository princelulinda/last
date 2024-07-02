export interface DialogModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
  active: boolean;
}
export interface DialogPayloadModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
}

export interface CloseDialog {
  response: string;
}

export type dialogTypeModel = 'confirm' | 'password' | 'pin' | '';
export type toastTypeModel = 'success' | 'failed' | 'info' | '';
