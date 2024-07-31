import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { LoanPendingModel } from '../loan.models';
import {
  AuthService,
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loan-pending',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, RouterLink],
  templateUrl: './loan-pending.component.html',
  styleUrl: './loan-pending.component.scss',
})
export class LoanPendingComponent implements OnInit, OnDestroy {
  bankId: number | null = null;
  selectedBank$: Observable<bankModel>;
  selectedBank: bankModel | null = null;
  loans: LoanPendingModel[] | undefined = undefined;
  isLoanDetailsShown = false;

  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;
  selectedLoan: LoanPendingModel | null = null;
  isLoanSelected = false;
  limit = 10;
  offset = 0;
  clientId$: Observable<number>;
  clientId: number | null = null;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private loanService: LoanService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private authService: AuthService,
    private _location: Location
  ) {
    this.selectedBank$ = this.configService.getSelectedBank();
    this.clientId$ = this.authService.getUserClientId();
    this.isBalanceShown$ = this.dialogService.getAmountState();

    //
  }

  ngOnInit() {
    this.getPendingLoansList();
    this.loanService.showLoanDetails$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isLoanDetailsShown => {
        this.isLoanDetailsShown = isLoanDetailsShown;
      });

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isShowed => {
        this.isBalanceShown = isShowed;
      });

    this.selectedBank$.subscribe((bank: bankModel) => {
      this.selectedBank = bank;
      this.bankId = bank.id;
    });

    this.clientId$.subscribe((id: number) => {
      this.clientId = id;
    });
  }

  getPendingLoansList() {
    this.loans = undefined;

    const data = {
      limit: this.limit,
      offset: this.offset,
      client_id: this.clientId ? this.clientId.toString() : '',
    };

    this.loanService
      .getPendingLoans(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(loans => {
        const response = loans as { objects: LoanPendingModel[] };
        this.loans = response.objects;
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

  selectLoan(loan: LoanPendingModel) {
    this.selectedLoan = loan;
    this.isLoanSelected = true;

    // console.log('selectLoan', this.selectedLoan);
  }

  nextPage() {
    this.offset += this.limit;

    this.getPendingLoansList();
  }

  previousPage() {
    this.offset -= this.limit;

    this.getPendingLoansList();
  }

  refreshLoansList() {
    this.getPendingLoansList();
  }
}
