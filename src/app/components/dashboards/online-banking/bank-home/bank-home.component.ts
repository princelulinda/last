import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { SwitchBankComponent } from '../../../../global/components/popups/switch-bank/switch-bank.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { ConfigService } from '../../../../core/services';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../../core/services/config/main-config.models';
import { ReusableListComponent } from '../../../../global/components/list/reusable-list/reusable-list.component';

@Component({
  selector: 'app-bank-home',
  standalone: true,
  imports: [
    RouterOutlet,
    SwitchBankComponent,
    RouterLink,
    SkeletonComponent,
    ReusableListComponent,
  ],
  templateUrl: './bank-home.component.html',
  styleUrl: './bank-home.component.scss',
})
export class BankHomeComponent implements OnInit, OnDestroy {
  bankMenus = [
    {
      name: 'Accounts',
      icon: 'user-circle',
      image: '',
      link: ['/b/banking/accounts', '/w/workstation/b/banking/accounts'],
    },
    {
      name: 'Savings',
      icon: 'piggy-bank',
      image: '',
      link: ['/b/banking/saving', '/w/workstation/b/banking/saving'],
    },
    {
      name: 'Loans',
      icon: '',
      image: ['loan-black.svg', 'loan-white.svg'],
      link: ['/b/banking/loan', '/w/workstation/b/banking/loan'],
    },
    {
      name: 'Withdrawals',
      icon: '',
      image: ['withdrawal-black.svg', 'withdrawal-white.svg'],
      link: ['/b/banking/withdrawal', '/w/workstation/b/banking/withdrawal'],
    },
    {
      name: 'Transfer',
      icon: 'paper-plane',
      image: '',
      link: ['/b/banking/transfer', '/w/workstation/b/banking/transfer'],
    },
  ];

  headers = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Details',
      field: ['description'],
      size: '',
    },
    {
      name: 'Amount',
      field: ['amount'],
      format: 'currency',
      size: '',
    },

    {
      name: 'Reference',
      field: ['code'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
    },
  ];

  clientVerified = '&filter_for_client=true';
  private onDestroy$: Subject<void> = new Subject<void>();
  selectedBank!: BankModel;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;

  constructor(private configService: ConfigService) {
    this.theme$ = this.configService.getMode();
    this.mainConfig$ = this.configService.getMainConfig();
  }
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    // this.getRecentTransactions()
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  deselectBank() {
    this.configService.resetSelectedBank();
  }

  transactionHeaders = [
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Amount',
      field: ['amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Account',
      field: [
        'other_info.credit_account.data.account_holder',
        'other_info.credit_account.data.account_number',
      ],
      size: '',
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
    },
    {
      name: 'Merchant reference',
      field: ['other_info.merchant_reference.data'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      css: 'status.css',
      class: 'badge',
      size: '',
    },
    {
      name: 'Description',
      field: ['comment'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
}
