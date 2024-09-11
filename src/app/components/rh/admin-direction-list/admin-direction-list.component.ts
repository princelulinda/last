import { Component } from '@angular/core';
import { ListComponent } from '../../../global/components/list/list/list.component';

@Component({
  selector: 'app-admin-direction-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './admin-direction-list.component.html',
  styleUrl: './admin-direction-list.component.scss',
})
export class AdminDirectionListComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/desk/direction/',
        field: 'id',
      },
    },
    {
      name: 'Direction Type',
      field: ['direction_type.title'],
      size: '',
      icon: 'direction_type.icon',
      css: 'direction_type.css',
    },
  ];
}
