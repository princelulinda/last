import { Component, OnDestroy, OnInit } from '@angular/core';

import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';

import { DebitAccountComponent } from '../debit-account/debit-account.component';

import { CommonModule } from '@angular/common';
import { bankModel } from '../../../core/db/models/bank/bank.model';
import { RouterLink } from '@angular/router';
import { accountsList } from '../../account/models';
import { DebitOptions } from '../transfer.model';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../../../core/services';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';
import { CreditAccountComponent } from '../credit-account/credit-account.component';
import { WalletList } from '../../wallet/wallet.models';
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
    CreditAccountComponent,
  ],
})
export class TransferComponent implements OnInit, OnDestroy {
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

  getSelectedAccount(event: accountsList | WalletList) {
    if (this.selectedDebitType === 'account') {
      const accountEvent = event as accountsList;
      this.debitNumber = accountEvent.acc_short_number;
      this.debitHolder = accountEvent.acc_holder;
    } else if (this.selectedDebitType === 'wallet') {
      const walletEvent = event as WalletList;
      this.debitNumber = walletEvent.code;
      this.debitHolder = walletEvent.account.account_holder;
      this.walletBankId = walletEvent.bank_id;
    }

    this.accountSelected = event as accountsList | null;
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
