import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { SwitchBankComponent } from '../../global/components/popups/switch-bank/switch-bank.component';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
import { bankModel } from '../../core/db/models/bank/bank.model';
import { ConfigService } from '../../core/services';
import { ModeModel } from '../../core/services/config/main-config.models';

@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [RouterOutlet, SwitchBankComponent, RouterLink, SkeletonComponent],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss',
})
export class BankHomeComponent implements OnInit, OnDestroy {
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
      image: ['loan-black.svg', 'loan-white.svg'],
      link: '/b/banking/loan',
    },
    {
      name: 'Withdrawals',
      icon: '',
      image: ['withdrawal-black.svg', 'withdrawal-white.svg'],
      link: '/b/banking/withdrawal',
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      image: '',
      link: '',
    },
  ];
  private onDestroy$: Subject<void> = new Subject<void>();
  selectedBank!: bankModel;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  constructor(private configService: ConfigService) {
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  deselectBank() {
    this.configService.resetSelectedBank();
  }
}
