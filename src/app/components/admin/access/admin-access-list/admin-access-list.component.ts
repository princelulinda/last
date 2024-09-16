import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-access-list',
  standalone: true,
  imports: [CommonModule, ListComponent, RouterLink],
  templateUrl: './admin-access-list.component.html',
  styleUrl: './admin-access-list.component.scss',
})
export class AdminAccessListComponent {
  url = '/hr/access/acl/categories/?';
  headers = [
    {
      name: 'Name',
      field: ['access_name'],
      size: '',
    },
    {
      name: 'Code',
      field: ['access_code'],
      size: '',
    },
    {
      name: 'Active',
      field: ['is_active'],
      size: '',
      boolean: true,
    },
  ];

  selectedMenu = 'list';
  crumbs = [
    {
      label: 'Admin',
      link: '/w/workstation/desk/admin/',
    },
    {
      label: 'Acesses',
      link: '/w/workstation/desk/admin/accesses',
    },
    {
      label: this.selectedMenu,
      active: true,
    },
  ];

  constructor() {
    //code
  }

  redirectTo(url: string) {
    return '/w/workstation/desk/admin' + url;
  }
}
