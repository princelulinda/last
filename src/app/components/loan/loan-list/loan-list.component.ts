import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { LoanListModel, LoanListResponseModel } from '../loan.models';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, RouterLink, RouterLinkActive],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit, OnDestroy {
  bankId: number | null = null;
  selectedBank$: Observable<bankModel>;
  selectedBank: bankModel | null = null;
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
    // this.bankId$ = this.store.select(BankState.GetSelectedClientBankId);
    this.selectedBank$ = this.configService.getSelectedBank();

    this.isBalanceShown$ = this.dialogService.getAmountState();

    //
  }

  ngOnInit() {
    // console.log('isBalanceSh', this.isBalanceShown);
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
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!!isBalanceSh', this.isBalanceShown);
      });

    this.selectedBank$.subscribe((bank: bankModel) => {
      // console.log(
      //   'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaankkkkkkkkkkkkkkkkkkkkkk',
      //   bank
      // );
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
        console.log('HHHHHHHHHHHHHHHHHHHHHHHLLLLLLLLLLLLLLLLLLLLLOANS', loans);
      });
  }

  // ngDoCheck() {
  //     console.log('screeen', screen.width);
  // }

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

  changeLoan() {
    this.loanService.switchLoanDetails();
  }

  selectLoan(loan: LoanListModel) {
    const response = loan;
    this.selectedLoan = response;
    this.isLoanSelected = true;

    // console.log('selectLoan', this.selectedLoan);
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
