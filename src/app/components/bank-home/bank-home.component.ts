import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwitchBankComponent } from '../../global/components/popups/switch-bank/switch-bank.component';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
import { bankModel } from '../../core/db/models/bank/bank.model';
import { BankOptions } from '../dashboards/dashboard.model';
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
  selectedbank!: bankModel;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  handlebankSelected(options: BankOptions) {
    if (options.banks && options.banks.length > 0) {
      this.selectedbank = options.banks[0]; // Sélectionne la première banque comme exemple
      console.log('Compte sélectionné :', this.selectedbank);
    }
  }
}
