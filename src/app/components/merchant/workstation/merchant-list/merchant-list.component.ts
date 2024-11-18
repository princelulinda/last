import { Component } from '@angular/core';

import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss',
})
export class MerchantListComponent {
  headers = [
    {
      name: 'Name',
      field: ['merchant_title'],
      size: '',
    },
    { name: 'Merchant code', field: ['merchant_code'], size: '' },

    { name: 'Client code', field: ['client.client_code'], size: '' },
    {
      name: 'Balance',
      field: ['available_balance'],
      format: 'currency',
      size: '',
    },
    {
      name: 'Reference Person',
      field: ['reference_client.client_full_name'],
      size: '',
    },
    {
      name: 'Reference code',
      field: ['reference_client.client_code'],
      size: '',
    },
    {
      name: 'Transactions',
      field: ['payment_bills'],
      size: '',
    },
    {
      name: 'Active',
      field: ['merchant_category.is_active'],
      size: '',
      boolean: true,
    },
  ];
}
