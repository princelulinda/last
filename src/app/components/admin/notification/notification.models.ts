import { ClientModel } from '../../../core/db/models/auth';

export interface NotificationModel {
  id: number;
  created_at: Date;
  client: ClientModel;
  send_by: string;
  organization: string;
  read_at: Date;
  subject: string;
  notification_types: string[];
  liste: string;
  send_at: Date;
  last_response: string;
  response_data: {
    sms: {
      success: boolean;
      response_message: string;
    };
    email: {
      success: boolean;
      response_code: string;
      response_data: object;
      response_message: string;
    };
  };
  status: {
    value: string;
    title: string;
    css: string;
  };
  notification_data: {
    emails: string[];
    subject: string;
    html_body: string;
    text_body: string;
    phone_numbers: string[];
  };
}
