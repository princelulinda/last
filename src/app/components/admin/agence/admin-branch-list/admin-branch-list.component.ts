import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
@Component({
  selector: 'app-admin-branch-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-branch-list.component.html',
  styleUrl: './admin-branch-list.component.scss',
})
export class AdminBranchListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/branch/',

        field: 'id',
      },
    },
    {
      name: 'Branche Code',
      field: ['formatted_code'],
      size: '',
    },
    {
      name: 'Organization',
      field: ['organization_tenant.institution_client.client_full_name'],
      size: '',
    },
    {
      name: 'Active',
      field: ['organization_tenant.is_active'],
      size: '',
      boolean: true,
    },
  ];
}
