import { Component } from '@angular/core';

import { ListComponent } from '../../../../global/components/list/list/list.component';
@Component({
  selector: 'app-admin-tellers-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-tellers-list.component.html',
  styleUrl: './admin-tellers-list.component.scss',
})
export class AdminTellersListComponent {
  headers = [
    {
      name: 'Teller',
      field: ['hr_operator.operator.employee_client.client_full_name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/tellers/',
        field: 'id',
      },
    },
    {
      name: 'Username',
      field: ['hr_operator.operator.username'],
      size: '',
    },
    {
      name: 'Operator',
      field: ['hr_treasurer.operator.employee_client.client_full_name'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['hr_operator.organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Acc Number',
      field: ['auxiliary_box.acc_number'],
      size: '',
    },
    {
      name: 'Description',
      field: ['auxiliary_box.category.description'],
      size: '',
    },
    {
      name: 'Active',
      field: ['hr_operator.organization.is_active'],
      size: '',
      boolean: true,
    },
  ];
}
