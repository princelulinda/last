import { Component } from '@angular/core';
import { ReusableListComponent } from '../../../../global/components/reusable-list/reusable-list.component';

@Component({
  selector: 'app-bills-reports',
  standalone: true,
  imports: [ReusableListComponent],
  templateUrl: './bills-reports.component.html',
  styleUrl: './bills-reports.component.scss',
})
export class BillsReportsComponent {
  billsHeaders = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
      canBeDisplayed: true,
    },
    {
      name: 'Total Amount',
      field: ['total_amount'],
      size: '',
      format: 'currency',
      canBeDisplayed: true,
    },
    {
      name: 'Account',
      field: ['created_by.client_full_name', 'created_by.client_code'],
      size: '',
      format: 'account',
      canBeDisplayed: true,
    },
    {
      name: 'Reference',
      field: ['payment_reference'],
      size: '',
      format: 'reference',
      canBeDisplayed: true,
    },
    {
      name: 'Merchant reference',
      field: ['partner_reference'],
      size: '',
      format: 'merchant',
      canBeDisplayed: true,
    },
    {
      name: 'Status',
      field: ['payment_status.title'],
      css: 'payment_status.css',
      class: 'badge',
      size: '',
      format: 'status',
      canBeDisplayed: true,
    },
    {
      name: 'Description',
      field: ['description'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
