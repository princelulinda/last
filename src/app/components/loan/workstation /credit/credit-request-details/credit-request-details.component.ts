import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoanService } from '../../../../../core/services/loan/loan.service';
import { LoanModel, SimulationResModel } from '../../../loan.models';
import { AmountVisibilityComponent } from '../../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-request-details',
  standalone: true,
  imports: [RouterLink, AmountVisibilityComponent, CommonModule],
  templateUrl: './credit-request-details.component.html',
  styleUrl: './credit-request-details.component.scss',
})
export class CreditRequestDetailsComponent
  implements OnInit, DoCheck, OnDestroy
{
  private onDestroy$: Subject<void> = new Subject<void>();

  selectedMenu = 'details';
  credit!: LoanModel;
  // loan: any;
  isLoading = false;
  creditId = '';
  clientId = '';
  // selectedClient: any;
  // selectedAction = false;
  // selectedSetting: any;
  // client: any;
  // error: any;
  simulationResult!: SimulationResModel;
  showModal = false;
  showPlan = false;

  constructor(
    private route: ActivatedRoute,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        this.creditId = data['id'];

        this.getCreditDetails();
      },
    });
  }

  refresh() {
    this.getCreditDetails();
  }

  ngDoCheck() {
    if (!this.credit) {
      this.showPlan = false;
    }
  }

  getCreditDetails() {
    this.isLoading = true;
    this.loanService
      .getLoanRequestDetails(this.creditId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: credit => {
          this.isLoading = false;
          this.credit = credit.object;
          this.clientId = this.credit.main_account.acc_client.toString();

          // this.getOperator();
        },
        error: error => {
          this.isLoading = false;
          error = 'error, try again please';
          return error;
        },
      });
  }

  simulateLoan() {
    this.isLoading = true;
    const data = {
      payment_number: this.credit.payment_number,
      amount: Number(this.credit.amount),
      mode: this.credit.cred_defaults.loan_type.bank_loan_mode,
      interest_rate: this.credit.interests_rate,
      period: this.credit.period,
    };

    this.loanService.simulateLoan(data).subscribe({
      next: result => {
        this.isLoading = false;
        this.showModal = true;
        this.simulationResult = result.object.response_data;
        // console.log('simm', this.simulationResult);
      },
    });
  }

  percentage(amount: string, percentage: string) {
    const one = Number(amount) / 100;
    return one * Number(percentage);
  }

  // updateLoanDetails(event: any) {
  //   this.showPlan = false;
  //   this.getCreditDetails();
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
