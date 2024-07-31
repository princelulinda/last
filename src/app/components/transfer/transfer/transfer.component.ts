import { Component } from '@angular/core';

import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';

import { DebitAccountComponent } from '../debit-account/debit-account.component';
import { CreditAccountComponent } from '../credit-account/credit-account.component';
import { CommonModule } from '@angular/common';
import { bankModel } from '../../../core/db/models/bank/bank.model';
// import { InstitutionInfoModel } from '../transfer.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  imports: [
    BeneficiariesComponent,
    DebitAccountComponent,
    CreditAccountComponent,
    CommonModule,
  ],
})
export class TransferComponent {
  isNewTransfer = false;

  // eslint-disable-next-line
  selectedInstitution: any;

  debitNumber = '';

  debitHolder = '';

  bankId!: bankModel;

  selectedCreditAccountType = '';
  selectedInstitutionType = '';

  selectedDebitType = '';

  // eslint-disable-next-line
  accountSelected: any;

  walletBankId: string | number = '';
  // eslint-disable-next-line
  debitOption: any;
  isTransferDone = false;

  // eslint-disable-next-line
  setSelectedInstitution(institution: any) {
    this.selectedInstitution = institution;
  }

  // eslint-disable-next-line
  setSelectedInstitutionType(type: any) {
    this.selectedInstitutionType = type;
  }

  // eslint-disable-next-line
  setSelectedCreditAccountType(type: any) {
    this.selectedCreditAccountType = type;
  }

  // eslint-disable-next-line
  setSelectedDebitAccountType(type: any) {
    this.selectedDebitType = type;
    this.resetAccountSelection();
  }

  resetAccountSelection() {
    this.accountSelected = null;
  }

  // eslint-disable-next-line
  getDebitOptions(event: any) {
    this.selectedDebitType = event.selectedDebitOption;
    this.debitOption = event;
    this.resetAccountSelection();
  }

  // eslint-disable-next-line
  getSelectedAccount(event: any) {
    if (this.selectedDebitType === 'account') {
      this.debitNumber = event.acc_short_number;
      this.debitHolder = event.acc_holder;
    } else if (this.selectedDebitType === 'wallet') {
      this.debitNumber = event.code;
      this.debitHolder = event.account.account_holder;
      this.walletBankId = event.bank_id;
    }

    this.accountSelected = event;
  }
  getTransferResponse(event: boolean) {
    this.isTransferDone = event;
    if (this.isTransferDone) {
      this.accountSelected = null;
      this.debitOption.isAmountChanging = true;
    }
  }
}
