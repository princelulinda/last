import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-admin-services-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-services-list.component.html',
  styleUrl: './admin-services-list.component.scss',
})
export class AdminServicesListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/service/',
        field: 'id',
      },
    },

    {
      name: 'Department',
      field: ['department.name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/department/',
        field: 'department.id',
      },
    },
    {
      name: 'Direction',
      field: ['department.direction.name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/direction/',
        field: 'department.direction.id',
      },
    },
    {
      name: 'Direction Type',
      field: ['department.direction.direction_type.title'],
      size: '',
      icon: 'department.direction.direction_type.icon',
      css: 'department.direction.direction_type.css',
    },
  ];
}
