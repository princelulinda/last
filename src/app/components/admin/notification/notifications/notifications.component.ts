import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  headers = [
    {
      name: 'Subject',
      field: ['subject'],
      size: '1',
      detail: {
        link: '/w/workstation/d/desk/admin/notification/',
        field: 'id',
      },
    },
    {
      name: 'Client',
      field: ['client.client_full_name'],
      size: '2',
    },
    {
      name: 'Code',
      field: ['client.client_code'],
      size: '1',
    },
    {
      name: 'Type',
      field: ['notification_types'],
      size: '1',
    },
    {
      name: 'Created at',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Send at',
      field: ['send_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Read at',
      field: ['read_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Status',
      field: ['status.title'],
      size: '',
      css: 'status.css',
      class: 'badge',
      format: '',
    },
  ];

  // constructor() {
  //     //comment
  // }
  // ngOnInit(): void {
  //     //comment
  // }
}
