import { Component } from '@angular/core';
import { AccountsListComponent } from '../accounts-list/accounts-list.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [AccountsListComponent, RouterOutlet],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {}
