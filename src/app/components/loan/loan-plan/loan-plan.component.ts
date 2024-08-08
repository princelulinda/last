import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../core/services';
import { VariableService } from '../../../core/services/variable/variable.service';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  LoanModel,
  LoanPlanResponseModel,
  PlanModel,
  ResponseDataModel,
} from '../loan.models';

@Component({
  selector: 'app-loan-plan',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './loan-plan.component.html',
  styleUrl: './loan-plan.component.scss',
})
export class LoanPlanComponent implements OnInit, OnDestroy {
  @Input() loan: LoanModel | undefined;
  @Input() isPending = false;
  @Output() isLoanPaid = new EventEmitter();

  loanPlan!: LoanPlanResponseModel | undefined;
  private onDestroy$: Subject<void> = new Subject<void>();

  singleLoanPlan!: PlanModel;
  pin = '';
  dialog$: Observable<DialogResponseModel>;
  plateform = '';
  plateform$: Observable<string>;

  constructor(
    private loanService: LoanService,
    private variableService: VariableService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.plateform$ = this.configService.getPlateform();
  }

  ngOnInit() {
    this.plateform$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: plateform => (this.plateform = plateform),
    });

    this.dialog$.subscribe({
      next: dialog => {
        if (dialog.action === 'confirm payment' && dialog.response.pin) {
          this.pin = dialog.response.pin;
          this.payLoan();
        }
      },
    });

    if (this.loan) {
      this.getLoanAmortizationPlan();
    }
  }

  getLoanAmortizationPlan() {
    this.loanPlan = undefined;

    if (this.loan) {
      this.loanService
        .getAmortizationPlan(this.loan.id.toString())
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(loanPlan => {
          const response = loanPlan as { object: LoanPlanResponseModel };
          this.loanPlan = response.object;
        });
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

  payLoan() {
    if (this.loan) {
      const data = {
        loan_id: this.loan.id,
        loan_plan_id: this.singleLoanPlan.id,
        pin_code: this.pin,
      };

      this.dialogService.dispatchLoading();

      this.loanService.payLoan(data).subscribe({
        next: response => {
          this.dialogService.closeLoading();

          // console.log('!!!!!!!!!!!!!!!!RRRRRRRRRRRRRresponse', response);
          const res = response as { object: ResponseDataModel };
          if (res.object.success == true) {
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: res.object.response_message,
            });

            this.isLoanPaid.emit(true);
          }

          if (res.object.success === false) {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: res.object.response_message,
            });
          }
        },

        error: error => {
          this.dialogService.closeLoading();

          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'something went wrong, please retry again',
          });
          return error;
          //
        },
      });
    }
  }

  ngOnDestroy() {
    this.loanService.toggleLoanDetails(false);

    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
