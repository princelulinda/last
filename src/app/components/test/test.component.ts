import { Component } from '@angular/core';
import { ReusableListComponent } from '../../global/components/reusable-list/reusable-list.component';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [ReusableListComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
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
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
    },
    {
      name: 'Merchant reference',
      field: ['other_info.merchant_reference.data'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
    },
    {
      name: 'Description',
      field: ['comment'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
