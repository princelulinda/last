import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';

import { DebitAccountComponent } from '../debit-account/debit-account.component';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountsListModel } from '../../account/models';
import { DebitOptionsModel } from '../transfer.model';
import { Observable, Subject } from 'rxjs';
import { ConfigService, DialogService } from '../../../core/services';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { CreditAccountComponent } from '../credit-account/credit-account.component';
import { WalletList } from '../../wallet/wallet.models';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    ReactiveFormsModule,
  ],
})
export class TransferComponent implements OnInit, OnDestroy {
  debitNumber = '';

  debitHolder = '';

  selectedCreditAccountType = '';
  selectedInstitutionType = '';

  selectedDebitType = '';
  currentTransferStep = '';
  accountSelected: AccountsListModel | null = null;
  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  walletBankId: string | number = '';
  @ViewChild('transferComponent') transferComponent!: CreditAccountComponent;
  isTransferDone = false;
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;

  constructor(
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.mode$ = this.configService.getMode();
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
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

  onTransferStepChange(newStep: string) {
    this.currentTransferStep = newStep;
  }
  setSelectedDebitAccountType(type: string) {
    this.selectedDebitType = type;
    this.resetAccountSelection();
  }
  doTransfer() {
    if (
      this.transferComponent.transferStep !== 'first step' &&
      this.accountSelected
    ) {
      this.transferComponent.showModal();
    }
  }
  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (this.currentTransferStep === 'second step' && this.accountSelected) {
      this.doTransfer();
    }
    console.log(event);
  }
  toggleTransferStep() {
    this.transferComponent.transferStepChange.emit('first step');
    this.transferComponent.transferStep = 'first step';
  }
  resetAccountSelection() {
    this.accountSelected = null;
  }

  getDebitOptions(event: string | DebitOptionsModel) {
    if (typeof event === 'string') {
      this.selectedDebitType = event;
    } else {
      this.selectedDebitType = event.selectedDebitOption;
    }
    this.resetAccountSelection();
  }

  getSelectedAccount(event: AccountsListModel | WalletList) {
    if (this.selectedDebitType === 'account') {
      const accountEvent = event as AccountsListModel;
      this.debitNumber = accountEvent.acc_short_number;
      this.debitHolder = accountEvent.acc_holder;
    } else if (this.selectedDebitType === 'wallet') {
      const walletEvent = event as WalletList;
      this.debitNumber = walletEvent.code;
      this.debitHolder = walletEvent.account.account_holder;
      this.walletBankId = walletEvent.bank_id;
    }

    this.accountSelected = event as AccountsListModel | null;
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

  transferForm = new FormGroup({
    accountNumber: new FormControl('', Validators.required),
  });
}
