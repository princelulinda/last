import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-wallet-list-ws',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './wallet-list-ws.component.html',
  styleUrl: './wallet-list-ws.component.scss',
})
export class WalletListWsComponent {
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
