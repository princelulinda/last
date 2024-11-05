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
import { SwitchBankComponent } from '../../../../global/components/popups/switch-bank/switch-bank.component';
import { AccountsListComponent } from '../../../account/accounts-list/accounts-list.component';
import { DebitOptionsModel, InstitutionInfoModel } from '../../transfer.model';
import { WalletListComponent } from '../../../wallet/banking/wallet-list/wallet-list.component';
import {
  ActiveMainConfigModel,
  ModeModel,
} from '../../../../core/services/config/main-config.models';
import { AccountsListModel } from '../../../account/models';
import { WalletModel } from '../../../wallet/wallet.models';
import { BankOptionsModel } from '../../../dashboards/dashboard.model';
import { VariableService } from '../../../../core/services/variable/variable.service';

@Component({
  selector: 'app-debit-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonComponent,
    SwitchBankComponent,
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
  // defaultBank: string | undefined;

  selectedBank: BankModel | null = null;
  selectedBank$!: Observable<BankModel>;

  banks: BankModel[] = [];
  clientBanks: BankModel[] = [];
  loadingBanks = false;

  // index = 0;
  // isBalanceShown = false;
  // isBalanceShown$: Observable<boolean>;

  lookupType = '';

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
    // this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.selectedBank$ = this.configService.getSelectedBank();
    // this.isBalanceShown$ = this.dialogService.getAmountState();
  }
  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    // this.mode$.subscribe({
    //   next: datas => {
    //     this.mode = datas;
    //   },
    // });
    // this.isBalanceShown$.subscribe(isBalanceShown => {
    //   this.isBalanceShown = isBalanceShown;
    // });
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

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['isTransactionDone'] && this.isTransactionDone) {
  //     this.updateAccount();
  //   }
  // }

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

  selectBank(bank: BankModel) {
    this.configService.setSelectedBank(bank);
  }

  // getClient(client: DebitOptionsModel) {
  //   this.debitAccount = client;
  //   const options = {
  //     id: this.debitAccount.id,
  //     acc_holder: this.debitAccount.lookup_title,
  //     acc_number: this.debitAccount.lookup_sub_title,
  //   };
  //   this.lookupOptions.emit(options);
  // }

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
    // if (accountType !== this.selectedDebitAccountType) {
    //   this.selectedDebitAccountType = null;
    // }
  }

  // updateAccount() {
  //   const options = {
  //     account: this.debitAccount ? this.debitAccount.account : '',
  //     wallet: this.debitWallet ? this.debitWallet.wallet : '',
  //     selectedDebitOption: this.selectedDebitAccountType as string,
  //     creditAccountType: this.creditAccountType,
  //     // isTransferDone: this.isTransactionDone,
  //     isAmountChanging: false,
  //     selectedInstitutionType: this.selectedInstitutionType,
  //     selectedInstitution: this.selectedInstitution,
  //   };

  //   this.variableService.REFRESH_ACCOUNT_LIST.set(true);
  //   this.variableService.REFRESH_WALLET_LIST.set(true);

  //   this.debitOptions.emit(options);
  // }

  getSwitchBankOptions(event: BankOptionsModel) {
    const options = {
      account: '',
      wallet: '',
      selectedDebitOption: '',
      creditAccountType: event.creditAccountType || '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: this.selectedInstitutionType,
      selectedInstitution: this.selectedInstitution,
    };

    this.variableService.REFRESH_ACCOUNT_LIST.set(true);

    this.debitOptions.emit(options);
    this.selectedDebitAccountType = (event.selectedDebitAccountType ?? null) as
      | 'account'
      | 'wallet'
      | null;
    this.debitAccount = event.debitAccount as unknown as DebitOptionsModel;
    this.debitWallet = event.debitWallet as unknown as DebitOptionsModel;
    this.banks = event.banks;
  }

  toggleBalance() {
    this.dialogService.displayAmount();
  }

  getAccountSelected(event: AccountsListModel | WalletModel) {
    if (this.selectedDebitAccountType === 'account') {
      this.selectedAccount.emit(event as AccountsListModel);
    } else {
      this.selectedWallet.emit(event as WalletModel);
    }
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    const options = {
      account: '',
      wallet: '',
      selectedDebitOption: '',
      creditAccountType: '',
      isTransferDone: this.isTransactionDone,
      isAmountChanging: false,
      selectedInstitutionType: '',
      selectedInstitution: '',
    };
    this.debitOptions.emit(options);
  }
}
