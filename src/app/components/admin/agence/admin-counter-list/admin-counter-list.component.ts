import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
@Component({
  selector: 'app-admin-counter-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-counter-list.component.html',
  styleUrl: './admin-counter-list.component.scss',
})
export class AdminCounterListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/counter/',
        field: 'id',
      },
    },
    {
      name: 'Counter Code',
      field: ['formatted_code'],
      size: '',
    },
    {
      name: 'Agence',
      field: ['branch.name'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['branch.organization_tenant.institution_client.client_full_name'],
      size: '',
    },
  ];
}
