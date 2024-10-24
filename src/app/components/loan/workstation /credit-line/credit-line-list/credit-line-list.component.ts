import { Component } from '@angular/core';
import { ListComponent } from '../../../../../global/components/list/list/list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-line-list',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: './credit-line-list.component.html',
  styleUrl: './credit-line-list.component.scss',
})
export class CreditLineListComponent {
  headers = [
    {
      name: 'Name',
      field: ['crel_account_info.acc_holder'],
      size: '',
      format: '',
      detail: {
        link: '/w/workstation/desk/credit/line/details/',
        field: 'id',
      },
    },

    {
      name: 'Code',
      field: ['crel_code'],
      size: '',
      format: '',
    },
    {
      name: 'Account',
      field: ['crel_account_info.acc_number'],
      size: '',
      format: '',
    },
    {
      name: 'Status',
      field: ['crel_status.title'],
      size: '',
      format: '',
      css: 'crel_status.css',
    },

    {
      name: 'Created at',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Expiry date',
      field: ['crel_expiry_date'],
      size: '',
      format: '',
    },
  ];
}
