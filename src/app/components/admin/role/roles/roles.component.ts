import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  headers = [
    {
      name: 'Role Name',
      field: ['role_name'],
      size: '',
      detail: {
        link: '/w/workstation/admin/roles/',
        field: 'id',
      },
    },
    {
      name: 'Service',
      field: ['content_object.value'],
      size: '',
    },
    {
      name: 'Role Type',
      field: ['role_type.title'],
      size: '',
      icon: 'role_type.icon',
      css: 'role_type.css',
      class: 'badge',
    },
    {
      name: 'Active',
      field: ['is_active'],
      size: '',
      boolean: true,
    },
  ];
}
