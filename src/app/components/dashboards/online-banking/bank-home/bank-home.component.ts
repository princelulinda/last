import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { SwitchBankComponent } from '../../../../global/components/popups/switch-bank/switch-bank.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { ConfigService, MenuService } from '../../../../core/services';
import {
  ModeModel,
  PlateformModel,
} from '../../../../core/services/config/main-config.models';
import { ReusableListComponent } from '../../../../global/components/list/reusable-list/reusable-list.component';
import {
  MenuSimpleModel,
  TypeMenuModel,
} from '../../../../core/db/models/menu/menu.models';

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
  private onDestroy$: Subject<void> = new Subject<void>();

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
      link: '/b/banking/transfer',
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
  selectedBank!: BankModel;

  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  activePlatform!: PlateformModel;
  plateform$: Observable<PlateformModel>;

  menus$: Observable<TypeMenuModel[]>;
  corporateBankingMenus: MenuSimpleModel[] = [];

  constructor(
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.theme$ = this.configService.getMode();
    this.plateform$ = this.configService.getPlateform();
    this.menus$ = this.configService.getTypeMenus();
  }
  ngOnInit(): void {
    this.plateform$.subscribe({
      next: plateform => {
        this.activePlatform = plateform;
      },
    });

    this.menus$.subscribe({
      next: menus => {
        if (menus) {
          [this.corporateBankingMenus] = this.menuService.getBankingMenu(
            'banking',
            'Dashboard',
            this.configService.toArray(menus)
          );
        }
      },
    });

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
