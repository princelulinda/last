import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupComponent } from '../../../../../global/components/lookups/lookup/lookup.component';
import { AutocompleteModel } from '../../../../../global/models/global.models';
import { DialogService, LoanService } from '../../../../../core/services';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { WorkstationDefaultValuesCreditModel } from '../../../../loan/loan.models';
import { AmountFieldComponent } from '../../../../../global/components/custom-field/amount-field/amount-field.component';

@Component({
  selector: 'app-credit-request',
  standalone: true,
  imports: [
    CommonModule,
    LookupComponent,
    ReactiveFormsModule,
    AmountFieldComponent,
  ],
  templateUrl: './credit-request.component.html',
  styleUrl: './credit-request.component.scss',
})
export class CreditRequestComponent {
  isLoading = false;
  account!: AutocompleteModel;
  isFormVisible = false;
  creditType!: AutocompleteModel;
  branch!: AutocompleteModel;
  defaultValuesLoan!: WorkstationDefaultValuesCreditModel;
  requestForm: FormGroup;
  fees!: number;
  insuranceFees!: number;
  guaranteeFees!: number;
  feesUnit = 'amount';
  insuranceFeesUnit = 'amount';
  guaranteeFeesUnit = 'amount';
  guarantee!: number;
  // insurance: any;

  constructor(
    private loanService: LoanService,
    private dialogService: DialogService,
    private router: Router
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
  getAccount(event: AutocompleteModel | null) {
    //
    this.account = event as AutocompleteModel;

    if (!this.account) {
      this.isFormVisible = false;
    }
  }

  getCreditType(event: AutocompleteModel | null) {
    this.creditType = event as AutocompleteModel;

    if (!this.creditType) {
      this.isFormVisible = false;
    }
  }

  getBranch(event: AutocompleteModel | null) {
    this.branch = event as AutocompleteModel;
  }

  goToForm() {
    this.isLoading = true;
    let branch;
    if (this.branch) {
      branch = this.branch.id;
    }

    const data = {
      account_id: this.account.id.toString(),
      loan_type_id: this.creditType.id.toString(),
      branch: branch,
    };
    this.loanService.getCreditTypeInfo(data).subscribe({
      next: loanInfo => {
        this.isLoading = false;
        console.log('loan type response', loanInfo);
        if (loanInfo.object.success) {
          this.defaultValuesLoan = loanInfo.object.response_data;

          this.isFormVisible = true;

          this.requestForm.patchValue({
            credit_type: this.defaultValuesLoan.loan_type.id,
          });

          if (this.requestForm.value.fees_amount) {
            this.fees = this.requestForm.value.fees_amount;
            this.insuranceFees = this.requestForm.value.insurance_amount;
          }
        } else if (!loanInfo.object.success) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: loanInfo.object.response_message,
          });
        }
      },
      error: (err: { object: { response_message: string } }) => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: err.object.response_message,
        });
      },
    });
  }

  updateUnitValue() {
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
    } else if (this.insuranceFeesUnit == 'amount') {
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

  changeInsuranceFeesUnit() {
    if (this.insuranceFeesUnit === 'percent') {
      this.insuranceFeesUnit = 'amount';
      this.insuranceFees = this.requestForm.value.insurance_amount;
    } else if (this.insuranceFeesUnit === 'amount') {
      this.insuranceFeesUnit = 'percent';

      // this.insuranceFees =
      //   (this.requestForm.value.insurance_amount *
      //     Number(this.defaultValuesLoan.insurance_rate)) /
      //   100;
    }
  }

  changeGuaranteeFeesUnit() {
    if (this.guaranteeFeesUnit === 'percent') {
      this.guaranteeFeesUnit = 'amount';
      this.guaranteeFees = this.requestForm.value.guarantee_rate;
    } else if (this.guaranteeFeesUnit === 'amount') {
      this.guaranteeFeesUnit = 'percent';

      this.guaranteeFees =
        (this.requestForm.value.amount *
          this.requestForm.value.guarantee_rate) /
        100;
    }
  }
  getAmount(event: { amount: number | null }) {
    const amount = event.amount as number;
    this.requestForm.patchValue({
      amount: amount,
    });

    // guarantee_rate should be checked first
    this.guarantee = (amount * this.defaultValuesLoan.guarantee_rate) / 100;

    if (this.feesUnit == 'percent') {
      this.fees = (amount * this.requestForm.value.fees_amount) / 100;
      this.guarantee = (amount * this.defaultValuesLoan.guarantee_rate) / 100;
    } else if (this.feesUnit == 'amount') {
      this.fees = this.requestForm.value.fees_amount;
    }

    if (this.insuranceFeesUnit == 'percent') {
      this.insuranceFees =
        (amount * this.requestForm.value.insurance_amount) / 100;
      // console.log('hello world', this.insurance);
    } else if (this.insuranceFeesUnit == 'amount') {
      this.insuranceFees = this.requestForm.value.insurance_amount;
    }

    if (this.guaranteeFeesUnit == 'percent') {
      this.guaranteeFees =
        (amount * this.requestForm.value.guarantee_rate) / 100;
    } else if (this.guaranteeFeesUnit == 'amount') {
      this.guaranteeFees = this.requestForm.value.guarantee_rate;
    }
  }
  requestLoan() {
    this.isLoading = true;

    const accountId = this.account.id;

    const interests_rate = this.requestForm.value.interest_rate;
    const penalities_rate = this.requestForm.value.penalities_rate;
    const fees_amount = this.requestForm.value.fees_amount;

    const body = {
      main_account: accountId,
      amount: this.requestForm.value.amount,
      payment_number: this.requestForm.value.payment_number,
      period: this.requestForm.value.period,
      first_date: this.requestForm.value.first_date,
      interests_rate: interests_rate,
      penalities_rate: penalities_rate,
      fees_amount: fees_amount,
      // fees_rate: '0',
      cred_defaults: this.defaultValuesLoan.id,
    };

    this.loanService.requestCredit(body).subscribe({
      next: response => {
        console.log('Loan Request Response', response);
        this.isLoading = false;
        if (response.object.amount) {
          this.router.navigate([
            '/w/workstation/d/desk/credit/request/' + response.object.id,
          ]);

          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: 'credit request sent successfully',
          });
        } else if (!response.object.amount) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'unable to request loan, please try again',
          });
        }
      },
      error: err => {
        this.isLoading = false;
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message: 'unable to request loan, please try again',
        });
        return err;
      },
    });
  }

  cancel() {
    this.router.navigate(['/w/workstation/d/desk/credit/request/list']);
  }
}
