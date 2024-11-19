import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
  // SimpleChanges,
  // OnChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Subject, Observable } from 'rxjs';

import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { UserInfoModel } from '../../../../core/db/models/auth';
import {
  BankService,
  ConfigService,
  AuthService,
  DialogService,
} from '../../../../core/services';
import { BankModel } from '../../../../core/db/models/bank/bank.model';

import { AccountsListComponent } from '../../../account/accounts-list/accounts-list.component';
import {
  DebitModel,
  DebitOptionsModel,
  InstitutionInfoModel,
} from '../../transfer.model';
import { WalletListComponent } from '../../../wallet/banking/wallet-list/wallet-list.component';
import {
  ActiveMainConfigModel,
  ModeModel,
} from '../../../../core/services/config/main-config.models';
import { AccountsListModel } from '../../../account/models';
import { WalletModel } from '../../../wallet/wallet.models';
//import { BankOptionsModel } from '../../../dashboards/dashboard.model';
import { VariableService } from '../../../../core/services/variable/variable.service';

@Component({
  selector: 'app-debit-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonComponent,
    AccountsListComponent,
    WalletListComponent,
  ],
  templateUrl: './debit-account.component.html',
  styleUrl: './debit-account.component.scss',
})
export class DebitAccountComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  private userInfo$: Observable<UserInfoModel>;
  clientInfo!: UserInfoModel;

  mainConfig$!: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;

  debitAccount: DebitOptionsModel | null = null;
  selectedDebitAccountType: 'account' | 'wallet' | null = null;

  // lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  clientId: number | null = null;

  debitWallet: DebitOptionsModel | null = null;

  selectedBank: BankModel | null = null;
  selectedBank$!: Observable<BankModel>;

  banks: BankModel[] = [];
  clientBanks: BankModel[] = [];
  loadingBanks = false;

  lookupType = '';
  @Output() activeDebitOption = new EventEmitter<DebitModel>();
  @Output() debitOptions = new EventEmitter<{
    account: string;
    wallet: string;

    selectedDebitOption: string;

    creditAccountType: string;
    isTransferDone: boolean;
    isAmountChanging: boolean;
    selectedInstitutionType: string;
    selectedInstitution: InstitutionInfoModel | string;
  }>();

  @Output() selectedAccount = new EventEmitter<AccountsListModel>();

  @Output() selectedWallet = new EventEmitter<WalletModel>();

  @Output() lookupOptions = new EventEmitter<{
    id?: string;
    acc_holder?: string;
    acc_number?: string;
  }>();

  @Input() isTransactionDone = false;
  @Input() creditAccountType = '';
  @Input() selectedInstitutionType = '';
  @Input() selectedInstitution: InstitutionInfoModel | string = '';

  @Input() isWalletShown = true;
  @Input() isAccountShown = true;

  @Input() menusBg = 'bg-secondary';

  lookup = new FormControl('');

  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService,
    private variableService: VariableService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.selectedBank$ = this.configService.getSelectedBank();
  }
  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });

    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        this.selectedBank$.subscribe({
          next: datas => {
            this.selectedBank = datas;
          },
        });
      },
    });

    this.getBanks();
  }

  selectBank(bank: BankModel) {
    this.configService.setSelectedBank(bank);
  }

  getBanks() {
    this.loadingBanks = true;
    this.bankService.getBanksList().subscribe({
      next: banks => {
        this.clientBanks = banks;
        this.loadingBanks = false;
      },
      error: () => {
        this.loadingBanks = false;
      },
    });
  }

  selectDebitType(accountType: 'account' | 'wallet') {
    this.selectedDebitAccountType = accountType;
    //console.log('hello', this.selectDebitAccountType)
  }

  selectDebitAccountType(accountType: 'account' | 'wallet') {
    this.selectedDebitAccountType = accountType;
    const options = {
      account: '',
      wallet: '',
      selectedDebitOption: this.selectedDebitAccountType,
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };
    this.debitOptions.emit(options);
    // console.log ('accountype',options)
  }
  selectAndEmitAccount(
    accountType: 'account' | 'wallet',
    event: AccountsListModel | WalletModel
  ) {
    this.selectedDebitAccountType = accountType;

    const selectedDetails = {
      selectedDebitOption: this.selectedDebitAccountType,
      details:
        accountType === 'account'
          ? (event as AccountsListModel)
          : (event as WalletModel),
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };

    // Émet l'objet combiné
    this.activeDebitOption.emit(selectedDetails);

    // Log l'objet émis
    // console.log('Options emitted:', selectedDetails);
  }

  getAccountSelected(event: AccountsListModel | WalletModel) {
    if (this.selectedDebitAccountType === 'account') {
      this.selectedAccount.emit(event as AccountsListModel);
    } else {
      this.selectedWallet.emit(event as WalletModel);
    }
  }

  toggleBalance() {
    this.dialogService.displayAmount();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();

    const options: DebitModel = {
      selectedDebitOption: '',
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: '',
      selectedInstitution: '',
      details: null, // Add the details property
    };

    // Emit the options object
    this.activeDebitOption.emit(options);

    // Log the emitted options
    // console.log('Options emitted on destroy:', options);
  }
}
