import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list.component';
@Component({
  selector: 'app-admin-treasure-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-treasure-list.component.html',
  styleUrl: './admin-treasure-list.component.scss',
})
export class AdminTreasureListComponent {
  headers = [
    {
      name: 'Operator',
      field: ['operator.employee_client.client_full_name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/treasure/',

        field: 'id',
      },
    },
    {
      name: 'Type',
      field: ['operator.employee_client.client_type.title'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['organization.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Company Type',
      field: ['organization.company_type_name'],
      size: '',
    },
  ];
}
