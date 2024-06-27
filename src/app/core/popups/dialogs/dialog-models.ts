export interface ToastModel {
  title: string;
  type: dialogTypeModel;
  message: string;
  active: boolean;
}

export interface ActionDialogModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
  active: boolean;
}

export interface CloseDialog {
  response: string;
}

export type dialogTypeModel =
  | 'success'
  | 'failed'
  | 'info'
  | 'confirm'
  | 'password'
  | 'pin'
  | '';
