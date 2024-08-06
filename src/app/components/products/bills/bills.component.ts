import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { MarketService } from '../../../core/services/market/market.service';
import { AuthService, ConfigService } from '../../../core/services';
import { Pagination } from '../../../core/services/merchant/model';
import { ModeModel } from '../../../core/services/config/main-config.models';
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

  constructor(
    private marketService: MarketService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.theme$ = this.configService.getMode();
    this.clientInfo$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: response => {
        this.theme = response;
      },
    });

    this.getBills();
    this.getPaymentRequestBills();
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
      this.billsPagination.filters!.offset = _offset;
      if (action === 'next') {
        this.getBills();
      } else if (action === 'prev') {
        this.getBills();
      }
      this.canMoveToNext = true;
      this.canMoveToPrevious = true;
    }
    if (this.activePage - 1 < 1) {
      this.billsPagination.filters!.offset = '';
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
