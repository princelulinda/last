import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  AuthService,
  ConfigService,
  MerchantService,
} from '../../../../core/services';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { UserInfoModel } from '../../../../core/db/models/auth';

import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { BillsModel } from '../bills.model';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, RouterLink, PaginationComponent],
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
  // countBills!: string | number;
  isLoading = true;
  paymentRequestBillsLoading = true;

  clientInfo$: Observable<UserInfoModel>;
  isMerchant!: boolean;
  totalData = 0;

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
  billsPagination: PaginationConfig = {
    filters: {
      limit: 30,
      offset: 0,
    },
  };

  activePage = 1;

  constructor(
    private merchantService: MerchantService,
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
    this.merchantService
      .getBills(this.billsPagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.totalData = response.count;
          this.merchantBills = response.objects;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.billsPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getBills();
  }

  getPaymentRequestBills() {
    this.paymentRequestBillsLoading = true;
    this.merchantService
      .getBills(this.billsPagination, 'requestPayments')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.paymentRequestBills = response.objects;
          this.paymentRequestBillsLoading = false;
        },
        error: () => {
          this.paymentRequestBillsLoading = false;
        },
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
