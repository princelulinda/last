import { Component, OnDestroy, OnInit } from '@angular/core';

import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';

import { DebitAccountComponent } from '../debit-account/debit-account.component';
import { CreditAccountComponent } from '../credit-account/credit-account.component';
import { CommonModule } from '@angular/common';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { RouterLink } from '@angular/router';
import { accountsList } from '../../account/models';
import { DebitOptions } from '../transfer.model';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../../../core/services';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
// import { InstitutionInfoModel } from '../transfer.model';

@Component({
  selector: 'app-transfer',
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',


  imports: [
    BeneficiariesComponent,
    DebitAccountComponent,
    CommonModule,
    RouterLink,
    CreditAccountComponent
],

})
export class TransferComponent implements OnInit, OnDestroy {
  selectedInstitution: any;

  debitNumber = '';

  debitHolder = '';

  bankId!: bankModel;

  selectedCreditAccountType = '';
  selectedInstitutionType = '';

  selectedDebitType = '';

  accountSelected: accountsList | null = null;

  walletBankId: string | number = '';

  isTransferDone = false;
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
  }
  // eslint-disable-next-line
  setSelectedInstitution(institution: any) {
    this.selectedInstitution = institution;
  }
  onChange(event: Event, type: 'institution' | 'credit'): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (type === 'institution') {
      this.setSelectedInstitutionType(selectedValue);
    } else if (type === 'credit') {
      this.setSelectedCreditAccountType(selectedValue);
    }
  }

  setSelectedInstitutionType(type: string) {
    this.selectedInstitutionType = type;
  }

  setSelectedCreditAccountType(type: string) {
    this.selectedCreditAccountType = type;
  }

  setSelectedDebitAccountType(type: string) {
    this.selectedDebitType = type;
    this.resetAccountSelection();
  }

  resetAccountSelection() {
    this.accountSelected = null;
  }

  getDebitOptions(event: string | DebitOptions) {
    if (typeof event === 'string') {
      this.selectedDebitType = event;
    } else {
      this.selectedDebitType = event.selectedDebitOption;
    }
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
    }
  }
    ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
