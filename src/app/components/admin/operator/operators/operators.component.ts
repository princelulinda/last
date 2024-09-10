import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-operators',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './operators.component.html',
  styleUrl: './operators.component.scss',
})
export class OperatorsComponent {
  headers = [
    {
      name: 'Username',
      field: ['operator.username'],
      size: '',
    },
    {
      name: 'Teller',
      field: ['is_teller'],
      size: '',
      boolean: true,
    },
    {
      name: 'Treasurer',
      field: ['is_treasurer'],
      size: '',
      boolean: true,
    },
    {
      name: 'Organization',
      field: ['organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Active',
      field: ['organization.is_active'],
      size: '',
      boolean: true,
    },
    {
      name: 'Status',
      field: ['status.title'],
      size: '',
      css: 'status.css',
      class: 'badge',
    },
  ];
  operatorHeader = [
    {
      name: 'Name',
      field: ['operator.name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/admin/operator/operator/',
        field: 'id',
      },
    },
    ...this.headers,
  ];
}
