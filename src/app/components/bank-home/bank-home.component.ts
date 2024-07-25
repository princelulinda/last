import { Component, EventEmitter, Output } from '@angular/core';
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
export class BankHomeComponent {
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
  @Output() backToPreviousState = new EventEmitter<void>();
  selectedBank!: bankModel;

  handleBankOptions(options: BankOptions) {
    // console.log('Options de banque reçues :', options);
    if (options.banks && options.banks.length > 0) {
      this.selectedBank = options.banks[0]; // Sélectionne la première banque comme exemple
      //console.log('Banque sélectionnée :', this.selectedBank);
    }
  }

  goBack() {
    this.backToPreviousState.emit();
  }
}
