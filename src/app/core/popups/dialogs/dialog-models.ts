export interface DialogModel {
  title: string;
  message: string;
  type: dialogTypeModel;
  action: string;
  active: boolean;
}

// export interface ActionDialogModel {

// }

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
