import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { VariableService } from '../../../core/services/variable/variable.service';
import { CommonModule } from '@angular/common';
import { LoanPlanComponent } from '../loan-plan/loan-plan.component';
import { LoanModel, PlanModel, ResponseDataModel } from '../loan.models';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, LoanPlanComponent, RouterOutlet],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.scss',
})
export class LoanDetailsComponent implements OnInit, OnDestroy, DoCheck {
  private onDestroy$: Subject<void> = new Subject<void>();
  loanId!: string;
  loan: LoanModel | undefined;
  selectedBank$: Observable<bankModel>;
  selectedBank!: bankModel;
  // theme = '';
  // theme$: Observable<string>;
  loanPlan!: PlanModel[] | undefined;
  singleLoanPlan!: PlanModel;
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;
  isSuccessPopupShown = false;
  // successMessage: any;
  isBalanceShown = false;
  isBalanceShown$: Observable<boolean>;
  showPlan = false;

  @ViewChild('myModal') myModal!: ElementRef;

  constructor(
    private configService: ConfigService,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private variableService: VariableService,
    private dialogService: DialogService
  ) {
    this.selectedBank$ = this.configService.getSelectedBank();
    this.dialog$ = this.dialogService.getDialogState();
    this.isBalanceShown$ = this.dialogService.getAmountState();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loanId = params['id'];

      if (this.loanId) {
        this.getLoanDetails();
      }
    });

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isShown: boolean) => (this.isBalanceShown = isShown));

    this.loanService.toggleLoanDetails(true);

    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: dialog => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog.response) {
            if (dialog.action === 'Confirm payment' && dialog.response.pin) {
              this.payLoan();
            }
          }
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.loanService.toggleLoanDetails(false);
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngDoCheck() {
    if (!this.loan) {
      this.showPlan = false;
    }
  }

  showModal(loanPlan: PlanModel) {
    this.singleLoanPlan = loanPlan;

    if (this.singleLoanPlan) {
      this.dialogService.openDialog({
        title: 'Confirm payment',
        type: 'pin',
        message: `Account <b> ${this.loan?.cred_client_main_account.acc_number} </b>  of <b>${this.loan?.cred_client_main_account.acc_holder}</b> <br/> will be debited with <b> BIF ${this.singleLoanPlan.crep_echeance_amount}</b>   `,
        action: 'confirm payment',
      });
    }
  }

  getLoanDetails() {
    this.loan = undefined;

    this.loanService.getLoanDetails(this.loanId).subscribe(loan => {
      const res = loan as { object: LoanModel };
      this.loan = res.object;

      this.selectedBank$.subscribe({
        next: (bank: bankModel) => {
          this.selectedBank = bank;
        },
      });
    });
  }

  getLoanAmortizationPlan() {
    this.loanPlan = undefined;
    this.loanService
      .getAmortizationPlan(this.loanId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(loanPlan => {
        const res = loanPlan as { object: PlanModel[] };
        this.loanPlan = res.object;
      });
  }

  payLoan() {
    const data = {
      loan_id: this.loanId,
      loan_plan_id: this.singleLoanPlan.id,
      pin_code: this.variableService.pin,
    };

    this.dialogService.dispatchLoading();

    this.loanService.payLoan(data).subscribe({
      next: res => {
        this.dialogService.closeLoading();

        const response = res as { object: ResponseDataModel };
        if (response.object.success == true) {
          this.getLoanDetails();

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: response.object.response_message,
          });
        }

        if (response.object.success === false) {
          // this.creditAccount = undefined;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: response.object.response_message,
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

        //
      },
    });
  }

  closeModal() {
    const modalElement = document.getElementById('');

    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  // getSuccessPopupOptions(event: any) {
  //   this.isSuccessPopupShown = event.isPopupShown;
  // }

  refreshLoanDetails() {
    this.getLoanDetails();
  }

  updateLoanDetails(event: boolean) {
    this.showPlan = false;
    this.refreshLoanDetails();
    return event;
  }
}
