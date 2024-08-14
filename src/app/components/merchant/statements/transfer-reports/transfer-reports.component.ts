import { Component } from '@angular/core';
import { ReusableListComponent } from '../../../../global/components/reusable-list/reusable-list.component';

@Component({
  selector: 'app-bills-reports',
  standalone: true,
  imports: [ReusableListComponent],
  templateUrl: './transfer-reports.component.html',
  styleUrl: './transfer-reports.component.scss',
})
export class TransferReportsComponent {
  transferHeaders = [
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
    },
    {
      name: 'Reference',
      field: ['payment_reference'],
      size: '',
    },
    {
      name: 'Merchant reference',
      field: ['partner_reference'],
      size: '',
    },
    {
      name: 'Status',
      field: ['payment_status.title'],
      css: 'payment_status.css',
      class: 'badge',
      size: '',
    },
    {
      name: 'Description',
      field: ['description'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
