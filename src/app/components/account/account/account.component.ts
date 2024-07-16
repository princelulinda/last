import { Component } from '@angular/core';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountsListComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {}
