import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { liveQuery } from 'dexie';

import { DbService } from '../../../core/db';
import { DialogService, LoanService } from '../../../core/services';
import { DefaultValuesLoanModel, LoanTypeModel } from '../loan.models';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { DebitAccountComponent } from '../../transfer/banking/debit-account/debit-account.component';
import { AccountsListModel } from '../../account/models';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';
import { AutocompleteModel } from '../../../global/models/global.models';
import { DebitModel } from '../../transfer/transfer.model';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LookupComponent,
    CommonModule,
    DebitAccountComponent,
    AmountFieldComponent,
  ],
  providers: [DatePipe],
  templateUrl: './loan-request.component.html',
  styleUrl: './loan-request.component.scss',
})
export class LoanRequestComponent implements OnInit, OnDestroy {
  requestForm: FormGroup;

  plateform$ = liveQuery(() => this.dbService.getOnce('mainconfigs'));
  plateform = '';
  amountBackground = 'rgba(241, 241, 241, 1)';

  accountWorkstation: AutocompleteModel | null = null;
  amount: number | null = 0;
  loansType!: LoanTypeModel;
  creditType: AutocompleteModel | null = null;
  defaultValuesLoan!: DefaultValuesLoanModel;

  isFormVisible = false;

  feesUnit = 'amount';
  insuranceFeesUnit = 'amount';
  guaranteeFeesUnit = 'amount';
  isLoading = false;
  fees: number | null = 0;
  insuranceFees: number | null = 0;
  guaranteeFees: number | null = 0;

  guarantee: number | null = 0;
  isWalletShown = false;
  defaultDate: string | null = '';

  private onDestroy$: Subject<void> = new Subject<void>();
  insurance: string | null = '';
  selectedAccount!: AccountsListModel;

  constructor(
    private _location: Location,
    private dbService: DbService,
    private loanService: LoanService,
    private datePipe: DatePipe,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.requestForm = new FormGroup({
      amount: new FormControl('', Validators.required),
      credit_type: new FormControl('', Validators.required),
      period: new FormControl('', Validators.required),
      first_date: new FormControl('', Validators.required),
      interest_rate: new FormControl('', Validators.required),
      penalities_rate: new FormControl('', Validators.required),
      fees_amount: new FormControl('', Validators.required),
      insurance_amount: new FormControl(0.0, Validators.required),
      guarantee_rate: new FormControl(0.0, Validators.required),
      payment_number: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    const currentDate = new Date();

    const oneMonthAhead = new Date(currentDate);
    oneMonthAhead.setMonth(currentDate.getMonth() + 1);

    this.defaultDate = this.datePipe.transform(oneMonthAhead, 'yyyy-MM-dd');

    this.plateform$.subscribe(plateform => {
      this.plateform = plateform.activePlateform;
    });

    this.getLoansType();
  }

  goBack() {
    this._location.back();
  }

  getAmount(evnt: { amount: number | null }) {
    const event = evnt as { amount: number };
    this.requestForm.patchValue({
      amount: event.amount,
    });

    this.guarantee =
      (event.amount * (this.defaultValuesLoan.guarantee_rate as number)) / 100;

    if (this.feesUnit == 'percent') {
      this.fees = (event.amount * this.requestForm.value.fees_amount) / 100;
      this.guarantee =
        (event.amount * (this.defaultValuesLoan.guarantee_rate as number)) /
        100;
      //
    } else if (this.feesUnit == 'amount') {
      this.fees = this.requestForm.value.fees_amount;
      //
    }

    if (this.insuranceFeesUnit == 'percent') {
      this.insuranceFees =
        (event.amount * this.requestForm.value.insurance_amount) / 100;

      //
    } else if (this.insuranceFeesUnit == 'amount') {
      this.insuranceFees = this.requestForm.value.insurance_amount;
      //
    }

    if (this.guaranteeFeesUnit == 'percent') {
      this.guaranteeFees =
        (event.amount * this.requestForm.value.guarantee_rate) / 100;
      //
    } else if (this.guaranteeFeesUnit == 'amount') {
      this.guaranteeFees = this.requestForm.value.guarantee_rate;
    }
  }

  handleDebitOptions(option: DebitModel) {
    if (option.selectedDebitOption === 'account') {
      this.selectedAccount = option.details as AccountsListModel;
    }
  }

  requestLoan() {
    this.isLoading = true;
    let accountId;
    if (this.plateform === 'workstation') {
      accountId = this.accountWorkstation?.id;
    } else {
      if (this.selectedAccount.id) {
        accountId = this.selectedAccount.id;
      }
    }
    let interests_rate!: string;
    let penalities_rate!: string;
    let fees_amount!: string;

    if (this.plateform === 'workStation') {
      interests_rate = this.requestForm.value.interest_rate;
      penalities_rate = this.requestForm.value.penalities_rate;
      fees_amount = this.requestForm.value.fees_amount;
    } else if (this.plateform === 'onlineBanking') {
      interests_rate = this.defaultValuesLoan.max_interest_rate;
      penalities_rate = this.defaultValuesLoan.penalities_rate;
      fees_amount = this.defaultValuesLoan.max_amount_fees;
    }

    const body = {
      main_account: accountId,
      amount: this.requestForm.value.amount,
      payment_number: this.requestForm.value.payment_number,
      period: this.requestForm.value.period,
      first_date: this.requestForm.value.first_date,
      interests_rate,
      penalities_rate,
      fees_amount,
      cred_defaults: this.defaultValuesLoan.id,
    };

    this.loanService.requestLoan(body).subscribe({
      next: res => {
        const response = res;

        this.isLoading = false;
        if (response.object.amount || response.object.success) {
          // if (this.plateform === 'onlineBanking')

          if (this.plateform === 'workstation') {
            this.router.navigate([
              '/w/workstation/d/desk/credit/request/' + response.object.id,
            ]);
          } else if (this.plateform === 'onlineBanking') {
            this.router.navigate([
              '/b/banking/loan/pending' + response.object.id,
            ]);
          }

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'credit request sent successfully',
          });
        } else if (!response.object.amount || !response.object.success) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'unable to request loan, please try again',
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: 'unable to request loan, please try again',
        });
      },
    });
  }

  getLoansType() {
    this.loanService.getLoanType().subscribe(loansType => {
      this.loansType = loansType.objects;
    });
  }

  goToForm() {
    this.isLoading = true;

    const data = {
      account_id: this.selectedAccount.id,
      loan_type_id: this.creditType?.id?.toString() || '',
      branch: this.selectedAccount,
    };
    this.loanService.getLoanTypeInfo(data).subscribe({
      next: loanInfo => {
        const response = loanInfo;
        this.isLoading = false;

        if (response.object.success) {
          this.defaultValuesLoan = response.object.response_data;

          this.isFormVisible = true;

          this.requestForm.patchValue({
            credit_type: this.defaultValuesLoan.loan_type.id,
          });

          if (this.requestForm.value.fees_amount) {
            this.fees = this.requestForm.value.fees_amount;
            this.insuranceFees = this.requestForm.value.insurance_amount;

            // console.log('feess', this.fees, this.insuranceFees);
          }
        } else if (!response.object.success) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: response.object.response_message,
          });
        }
      },
      error: err => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: err.object.response_message,
        });
      },
    });
  }

  getCreditType(event: AutocompleteModel | null) {
    //
    this.creditType = event;

    if (!this.creditType) {
      this.isFormVisible = false;
    }
    // this.selectLoanType()

    // console.log('eveeeentt', this.creditType);
  }

  getAccount(event: AutocompleteModel | null) {
    this.accountWorkstation = event;

    // ==================================================================================

    // if (!this.account && !this.accountWorkstation) {
    //   this.isFormVisible = false;
    // }
    if (!this.accountWorkstation) {
      this.isFormVisible = false;
    }
  }

  changeFeesUnit() {
    if (this.feesUnit === 'percent') {
      this.feesUnit = 'amount';
      this.fees = this.requestForm.value.fees_amount;
    } else if (this.feesUnit === 'amount') {
      this.feesUnit = 'percent';
      this.fees =
        (this.requestForm.value.amount * this.requestForm.value.fees_amount) /
        100;
    }
  }

  updateUnitValues() {
    if (this.feesUnit == 'percent') {
      this.fees =
        (this.requestForm.value.amount * this.requestForm.value.fees_amount) /
        100;
    } else if (this.feesUnit == 'amount') {
      this.fees = this.requestForm.value.fees_amount;
    }

    if (this.insuranceFeesUnit == 'percent') {
      this.insuranceFees =
        (this.requestForm.value.amount *
          this.requestForm.value.insurance_amount) /
        100;
    } else if (this.insuranceFeesUnit == 'amount') {
      this.insuranceFees = this.requestForm.value.insurance_amount;
    }

    if (this.guaranteeFeesUnit == 'percent') {
      this.guaranteeFees =
        (this.requestForm.value.amount *
          this.requestForm.value.guarantee_rate) /
        100;
    } else if (this.guaranteeFeesUnit == 'amount') {
      this.guaranteeFees = this.requestForm.value.guarantee_rate;
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
