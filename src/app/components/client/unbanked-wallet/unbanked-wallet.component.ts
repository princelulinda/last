import { Component } from '@angular/core';
import { ListComponent } from '../../../global/components/list/list/list.component';
@Component({
  selector: 'app-unbanked-wallet',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './unbanked-wallet.component.html',
  styleUrl: './unbanked-wallet.component.scss',
})
export class UnbankedWalletComponent {
  headers = [
    {
      name: 'Name',
      field: ['account.account_holder'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/client/detail/',
        field: 'client_id',
      },
    },
    { name: 'Title', field: ['title'], size: '' },
    { name: 'Wallet Number', field: ['code'], size: '' },
    {
      name: 'Balance',
      field: ['actual_balance'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Wallet Type',
      field: ['wallet_type_title'],
      size: '',
    },
  ];
}
