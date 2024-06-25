export interface DialogModel {
  modal: {
    title: string;
    type: string;
    message: string;
    response: string | null;
    action: string;
  };
}
