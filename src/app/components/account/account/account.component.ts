import { Component } from '@angular/core';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';
import { RouterOutlet } from '@angular/router';
import { accountsList } from '../models';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountsListComponent, RouterOutlet],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  handleAccountSelected(account: accountsList) {
    console.log('Compte sélectionné :', account);
  }
}
