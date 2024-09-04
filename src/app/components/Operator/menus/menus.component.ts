import { Component } from '@angular/core';
import { ListComponent } from '../../../global/components/list/list.component';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss',
})
export class MenusComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      icon: 'icon',
      detail: {
        link: '/w/workstation/desk/admin/menu/',
        field: 'id',
      },
      format: '',
    },
    {
      name: 'URL',
      field: ['component_url'],
      size: '5',
      format: '',
    },
    {
      name: 'Group',
      field: ['menu_group_info.name', 'menu_group_info.menu_group_type.title'],
      size: '',
    },
    {
      name: 'Active',
      field: ['active'],
      size: '2',
      boolean: true,
      format: '',
    },
  ];
}
