import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { map } from 'rxjs';
import { NotificationModel } from '../../../components/admin/notification/notification.models';

@Injectable({
  providedIn: 'root',
})
export class NotificationDetailsService {
  constructor(private apiService: ApiService) {
    //
  }

  getNotificationDetails(notification_id: string) {
    return this.apiService
      .get<{
        object: NotificationModel;
      }>('/comm/notifications/' + notification_id + '/')
      .pipe(
        map(data => {
          return data;
        })
      );
  }
}
