import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwitchBankComponent } from '../../global/components/popups/switch-bank/switch-bank.component';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [RouterOutlet, SwitchBankComponent, RouterLink, SkeletonComponent],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss',
})
export class BankHomeComponent implements OnInit {
  bankMenus = [
    {
      name: 'Accounts',
      icon: 'user-circle',
      image: '',
      link: '/b/banking/accounts',
    },
    {
      name: 'Savings',
      icon: 'piggy-bank',
      image: '',
      link: '/b/banking/saving',
    },
    {
      name: 'Loans',
      icon: '',
      image: ['loan-black.svg'],
      link: '',
    },
    {
      name: 'Withdrawals',
      icon: '',
      image: ['withdrawal-black.svg'],
      link: '',
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      image: '',
      link: '',
    },
  ];

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
