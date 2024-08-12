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
    // {
    //     name: 'Merchant',
    //     field: ['merchant_teller.merchant.merchant_title'],
    //     size: '',
    // },
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Total Amount',
      field: ['total_amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Account',
      field: ['created_by.client_full_name', 'created_by.client_code'],
      size: '',
      format: 'account',
    },
    {
      name: 'Reference',
      field: ['payment_reference'],
      size: '',
      format: 'reference',
    },
    {
      name: 'Merchant reference',
      field: ['partner_reference'],
      size: '',
      format: 'merchant',
    },
    {
      name: 'Status',
      field: ['payment_status.title'],
      css: 'payment_status.css',
      class: 'badge',
      size: '',
      format: 'status',
    },
    {
      name: 'Description',
      field: ['description'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
