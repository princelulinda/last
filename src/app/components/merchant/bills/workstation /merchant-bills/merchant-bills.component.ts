import { Component } from '@angular/core';

import { ListComponent } from '../../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-merchant-bills',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './merchant-bills.component.html',
  styleUrl: './merchant-bills.component.scss',
})
export class MerchantBillsComponent {
  headers = [
    {
      name: 'Merchant Name',
      field: ['merchant_teller.merchant.merchant_title'],
      size: '',
    },
    { name: 'Date', field: ['created_at'], size: '', format: 'date' },

    {
      name: 'Amount',
      field: ['total_amount'],
      size: '',
      format: 'currency',
    },
    { name: 'Payment reference', field: ['payment_reference'], size: '' },

    {
      name: 'Payment status',
      field: ['payment_status.title'],
      size: '',
      css: 'payment_status.css',
      class: 'badge',
    },
    {
      name: '',
      field: ['code'],
    },
  ];
}
