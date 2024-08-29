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
import { PaginationComponent } from '../../../dev/pagination/pagination.component';
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

  canMoveToNext = false;
  canMoveToPrevious = false;
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
        next: (response: { objects: BillsModel[]; count: number }) => {
          this.totalData = response.count;
          this.merchantBills = response.objects;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  // onLimitChange(limit: number) {
  //   this.billsPagination.filters.limit = limit;
  //   this.onPageChange(this.activePage);
  // }

  // onPageChange(page: number) {
  //   this.activePage = page;
  //   const _offset = this.billsPagination.filters.limit * (page - 1);
  //   this.billsPagination.filters.offset = _offset;
  //   this.getBills();
  // }

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

  // getPagination(action = 'next') {
  //   if (action === 'next') {
  //     this.activePage++;
  //   } else {
  //     this.activePage--;
  //   }
  //   // action === 'next' ? this.activePage++ : this.activePage--;
  //   if (this.activePage >= 1 && this.activePage <= this.pages) {
  //     const _offset =
  //       this.billsPagination.filters?.limit * (this.activePage - 1);
  //     this.billsPagination.filters!.offset = _offset;
  //     if (action === 'next') {
  //       this.getBills();
  //     } else if (action === 'prev') {
  //       this.getBills();
  //     }
  //     this.canMoveToNext = true;
  //     this.canMoveToPrevious = true;
  //   }
  //   if (this.activePage - 1 < 1) {
  //     this.billsPagination.filters!.offset = 0;
  //     this.canMoveToPrevious = false;
  //     this.canMoveToNext = false;
  //   } else if (this.activePage + 1 > this.pages) {
  //     this.canMoveToNext = false;
  //   }
  // }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
