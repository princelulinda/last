import { Component } from '@angular/core';
import { ListComponent } from '../../../global/components/list/list.component';

@Component({
  selector: 'app-list-test',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './list-test.component.html',
  styleUrl: './list-test.component.scss',
})
export class ListTestComponent {
  headers = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Details',
      field: ['description'],
      size: '',
    },
    {
      name: 'Amount',
      field: ['amount'],
      format: 'currency',
      size: '',
    },

    {
      name: 'Reference',
      field: ['code'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
    },
  ];
}
