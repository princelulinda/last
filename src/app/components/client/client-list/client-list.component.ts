import { Component } from '@angular/core';
import { ListComponent } from '../../../global/components/list/list/list.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent {
  headers = [
    {
      name: 'Name',
      field: ['client_full_name'],
      size: '2',
      detail: {
        link: '/w/workstation/d/desk/client/detail/',
        field: 'client_id',
      },
    },
    { name: 'Code', field: ['client_code'], size: '' },
    { name: 'Client category', field: ['client_category_title'], size: '' },
    {
      name: 'Client classification',
      field: ['client_classification.title'],
      size: '',
      css: 'client_classification.css',
      class: 'badge',
    },
    { name: 'Type', field: ['client_category_type_title'], size: '' },
    { name: 'Gender', field: ['client_sex'], size: '' },
  ];
}
