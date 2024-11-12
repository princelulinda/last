import { Component } from '@angular/core';

import { ListComponent } from '../../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './credit-list.component.html',
  styleUrl: './credit-list.component.scss',
})
export class CreditListComponent {
  headers = [
    {
      name: 'Client',
      field: ['cred_holder'],
      size: '',
      format: '',
      detail: {
        link: '/w/workstation/d/desk/credit/details/',
        field: 'id',
      },
    },
    {
      name: 'Date',
      field: ['cred_first_date'],
      size: '',
      format: 'date',
    },

    {
      name: 'Loan id',
      field: ['cred_code'],
      size: '',
      format: '',
    },
    {
      name: 'Type',
      field: ['cred_branch_defaults.loan_type.title'],
      size: '',
    },
    {
      name: 'Credit Amount',
      field: ['cred_amount'],
      size: '',
      format: 'currency',
    },

    {
      name: 'Credit status',
      field: ['cred_status.title'],
      size: '',
      format: '',
      css: 'cred_status.css',
      class: 'badge',
    },
  ];

  payment = [
    { name: 'Type of payment', abbrev: '' },
    { name: '', abbrev: '' },
    { name: '', abbrev: '' },
  ];
}
