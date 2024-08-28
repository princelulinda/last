import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { BankModel } from '../../../core/db/models/bank/bank.model';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { LoanListModel, LoanListResponseModel } from '../loan.models';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit, OnDestroy {
  bankId: number | null = null;
  selectedBank$: Observable<BankModel>;
  selectedBank: BankModel | null = null;
  loans: LoanListModel[] | undefined = undefined;
  isLoanDetailsShown = false;

  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;
  selectedLoan: LoanListModel | null = null;
  isLoanSelected = false;
  limit = 10;
  offset = 0;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private loanService: LoanService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private _location: Location
  ) {
    this.selectedBank$ = this.configService.getSelectedBank();

    this.isBalanceShown$ = this.dialogService.getAmountState();
  }

  ngOnInit() {
    this.getLoansList();

    this.loanService.showLoanDetails$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isLoanDetailsShown => {
        this.isLoanDetailsShown = isLoanDetailsShown;
      });

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isBalanceShown => {
        this.isBalanceShown = isBalanceShown;
      });

    this.selectedBank$.subscribe((bank: BankModel) => {
      this.selectedBank = bank;
      this.bankId = bank.id;
    });
  }

  getLoansList() {
    this.loans = undefined;

    const data = {
      limit: this.limit,
      offset: this.offset,
    };

    this.loanService
      .getLoansListWithPagination(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(loans => {
        const response = loans as { object: LoanListResponseModel };
        this.loans = response.object.response_data;
      });
  }

  goBack() {
    this._location.back();
    this.isLoanSelected = false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toggleBalance() {
    this.dialogService.displayAmount();
  }

  // changeLoan() {
  //   this.loanService.switchLoanDetails();
  // }

  selectLoan(loan: LoanListModel) {
    this.selectedLoan = loan;
    this.isLoanSelected = true;
  }

  nextPage() {
    this.offset += this.limit;

    this.getLoansList();
  }

  previousPage() {
    this.offset -= this.limit;

    this.getLoansList();
  }

  refreshLoansList() {
    this.getLoansList();
  }
}
