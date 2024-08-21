import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { bankModel } from '../../../core/db/models/bank/bank.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import {
  LoanModel,
  PlanModel,
  ResModel,
  ResponseDataModel,
  SimulationResModel,
} from '../loan.models';
import { LoanPlanComponent } from '../loan-plan/loan-plan.component';

@Component({
  selector: 'app-loan-pending-details',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoanPlanComponent],
  templateUrl: './loan-pending-details.component.html',
  styleUrl: './loan-pending-details.component.scss',
})
export class LoanPendingDetailsComponent implements OnInit, DoCheck, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  loanId!: string;
  loan: LoanModel | undefined;
  selectedBank$: Observable<bankModel>;
  selectedBank!: bankModel;
  loanPlan: PlanModel[] | undefined;
  singleLoanPlan!: PlanModel;
  dialog$: Observable<DialogResponseModel>;
  pin = '';

  isSuccessPopupShown = false;
  // successMessage: any;
  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;
  simulationResult!: SimulationResModel;
  showPlan = false;

  constructor(
    private configService: ConfigService,
    private loanService: LoanService,
    private _route: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.selectedBank$ = this.configService.getSelectedBank();
    this.isBalanceShown$ = this.dialogService.getAmountState();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    this._route.params.subscribe(params => {
      const id = params['id'] as string;
      this.loanId = id;

      if (this.loanId) {
        this.getLoanDetails();
      }
    });

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(bool => (this.isBalanceShown = bool));

    this.loanService.toggleLoanDetails(true);

    this.dialog$.subscribe({
      next: dialog => {
        if (dialog.action === 'Confirm payment' && dialog.response.pin) {
          this.pin = dialog.response.pin;
          this.payLoan();
        }
      },
    });

    this.showPlan = true;
  }

  ngDoCheck() {
    if (!this.loan) {
      this.showPlan = false;
    }
  }

  getLoanDetails() {
    this.loan = undefined;
    this.loanService
      .getLoanRequestDetails(this.loanId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(loan => {
        const res = loan as { object: LoanModel };

        this.loan = res.object;

        this.selectedBank$.subscribe({
          next: bank => {
            this.selectedBank = bank;
          },
        });
      });
  }

  getLoanAmmortissmentPlan() {
    this.loanPlan = undefined;

    this.loanService
      .getAmortizationPlan(this.loanId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(loanPlan => {
        const result = loanPlan as PlanModel[];
        this.loanPlan = result;
      });
  }

  payLoan() {
    const data = {
      loan_id: this.loanId,
      loan_plan_id: this.singleLoanPlan.id,
      pin_code: this.pin,
    };
    this.dialogService.dispatchLoading();

    this.loanService.payLoan(data).subscribe({
      next: response => {
        this.dialogService.closeLoading();

        const res = response as { object: ResModel };
        if (res.object.success === true) {
          this.getLoanAmmortissmentPlan();
          this.getLoanDetails();
          this.isSuccessPopupShown = true;

          // this.successMessage = [
          //   {
          //     label: 'Reference',
          //     value: res.object.response_data.reference,
          //   },
          // ];
        }

        if (res.object.success === false) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: res.object.response_message,
          });
        }
      },

      error: err => {
        this.dialogService.closeLoading();

        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: 'something went wrong, please retry again',
        });

        return err;
      },
    });
  }

  // getSuccessPopupOptions(event: any) {
  //   this.isSuccessPopupShown = event.isPopupShown;
  // }

  simulateLoan() {
    if (this.loan) {
      const data = {
        payment_number: this.loan.payment_number,
        amount: Number(this.loan.amount),
        mode: this.loan.cred_defaults.loan_type.bank_loan_mode,
        interest_rate: this.loan.interests_rate,
        period: this.loan.period,
      };

      this.loanService.simulateLoan(data).subscribe({
        next: result => {
          const response = result as { object: ResponseDataModel };

          this.simulationResult = response.object
            .response_data as SimulationResModel;
        },
      });
    }
  }

  refreshLoanDetails() {
    this.getLoanDetails();
  }

  togglePlan() {
    this.showPlan = true;
  }

  ngOnDestroy(): void {
    this.loanService.toggleLoanDetails(false);

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
