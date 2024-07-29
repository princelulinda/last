import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';

import { MarketService } from '../../../core/services/market/market.service';
import { AuthService, ConfigService } from '../../../core/services';
// import { AuthState, MenuState, SwitchThemeState } from 'src/app/shared';

import { Pagination } from '../../../core/services/merchant/model';
import {
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { UserInfoModel } from '../../../core/db/models/auth';
import { BillsModel, paymentBillsModel } from '../products.model';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, RouterLink],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.scss',
})
export class BillsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  seeMore = false;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  merchantBills!: BillsModel[] | null;
  paymentRequestBills!: BillsModel[];
  // billsReport: any;
  countBills!: string | number;
  isLoading = true;
  paymentRequestBillsLoading = true;

  clientInfo$: Observable<UserInfoModel>;
  isMerchant!: boolean;

  billsHeaders = [
    // {
    //     name: 'Merchant',
    //     field: ['merchant_teller.merchant.merchant_title'],
    //     size: '',
    // },
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },
    {
      name: 'Total Amount',
      field: ['total_amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Account',
      field: ['created_by.client_full_name', 'created_by.client_code'],
      size: '',
    },
    {
      name: 'Reference',
      field: ['payment_reference'],
      size: '',
    },
    {
      name: 'Merchant reference',
      field: ['partner_reference'],
      size: '',
    },
    {
      name: 'Status',
      field: ['payment_status.title'],
      css: 'payment_status.css',
      class: 'badge',
      size: '',
    },
    {
      name: 'Description',
      field: ['description'],
      size: '4',
      canBeDisplayed: false,
    },
  ];
  billsPagination: Pagination = {
    filters: {
      limit: 15,
      offset: 0,
    },
  };

  canMoveToNext = false;
  canMoveToPrevious = false;
  pages = 1;
  activePage = 1;

  selectedMarket!: PlateformModel;
  selectedMarket$: Observable<PlateformModel>;

  constructor(
    private marketService: MarketService,
    private configService: ConfigService,
    private authService: AuthService
    //   private menuService: MenuService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
    this.theme$ = this.configService.getMode();
    // this.clientInfo$ = this.store.select(AuthState.GetClientInfo);
    this.clientInfo$ = this.authService.getUserInfo();
    // this.selectedMarket$ = this.store.select(MenuState.GetSelectedMarket);
    this.selectedMarket$ = this.configService.getPlateform();
  }

  ngOnInit() {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: response => {
        this.theme = response;
      },
    });

    this.clientInfo$.subscribe({
      next: (response: UserInfoModel) => {
        if (response.client.is_merchant) {
          this.isMerchant = response.client.is_merchant;
          this.getBills();
          this.getPaymentRequestBills();
        }
      },
    });
    this.selectedMarket$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (market: PlateformModel) => {
        this.selectedMarket = market;
      },
    });
  }

  getBills() {
    this.isLoading = true;
    this.merchantBills = null;
    this.marketService
      .getBills(this.billsPagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: paymentBillsModel) => {
          this.merchantBills = response.objects;
          this.countBills = response.count;
          this.pages = Math.round(this.countBills / 6);
          if (
            this.countBills >
            parseInt(this.billsPagination.filters?.limit as string)
          ) {
            this.canMoveToNext = true;
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  getPaymentRequestBills() {
    this.paymentRequestBillsLoading = true;
    this.marketService
      .getBills(this.billsPagination, 'requestPayments')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: paymentBillsModel) => {
          this.paymentRequestBills = response.objects;
          this.paymentRequestBillsLoading = false;
        },
        error: () => {
          this.paymentRequestBillsLoading = false;
        },
      });
  }

  getPagination(action = 'next') {
    if (action === 'next') {
      this.activePage++;
    } else {
      this.activePage--;
    }
    // action === 'next' ? this.activePage++ : this.activePage--;
    if (this.activePage >= 1 && this.activePage <= this.pages) {
      const _offset = (
        parseInt(this.billsPagination.filters?.limit as string) *
        (this.activePage - 1)
      ).toString();
      (this.billsPagination.filters as string) = _offset;
      if (action === 'next') {
        this.getBills();
      } else if (action === 'prev') {
        this.getBills();
      }
      this.canMoveToNext = true;
      this.canMoveToPrevious = true;
    }
    if (this.activePage - 1 < 1) {
      (this.billsPagination.filters as string) = '';
      this.canMoveToPrevious = false;
      this.canMoveToNext = false;
    } else if (this.activePage + 1 > this.pages) {
      this.canMoveToNext = false;
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
