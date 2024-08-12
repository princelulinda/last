import { Component } from '@angular/core';
import { ReusableListComponent } from '../../../../global/components/reusable-list/reusable-list.component';
@Component({
  selector: 'app-payment-reports',
  standalone: true,
  imports: [ReusableListComponent],
  templateUrl: './payment-reports.component.html',
  styleUrl: './payment-reports.component.scss',
})
export class PaymentReportsComponent {
  paymentsHeaders = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Amount',
      field: ['amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Account',
      field: [
        'other_info.credit_account.data.account_holder',
        'other_info.credit_account.data.account_number',
      ],
      size: '',
      format: 'account',
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
      format: 'reference',
    },
    {
      name: 'Merchant reference',
      field: ['other_info.merchant_reference.data'],
      size: '',
      format: 'merchant',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
      format: 'status',
    },
    {
      name: 'Description',
      field: ['comment'],
      size: '4',
      canBeDisplayed: true,
    },
  ];
}
