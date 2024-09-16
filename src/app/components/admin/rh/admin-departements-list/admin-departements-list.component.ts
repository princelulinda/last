import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-admin-departements-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-departements-list.component.html',
  styleUrl: './admin-departements-list.component.scss',
})
export class AdminDepartementsListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/department/',
        field: 'id',
      },
    },
    {
      name: 'Direction Name',
      field: ['direction.name'],
      size: '',
    },
    {
      name: 'Direction Type',
      field: ['direction.direction_type.title'],
      size: '',
      icon: 'direction.direction_type.icon',
      css: 'direction.direction_type.css',
    },
  ];
}
