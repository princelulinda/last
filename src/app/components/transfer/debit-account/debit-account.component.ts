import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-debit-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './debit-account.component.html',
  styleUrl: './debit-account.component.scss',
})
export class DebitAccountComponent {
  //   private onDestroy$: Subject<void> = new Subject<void>();
  //   userInfo!: userInfoModel;
  //   clientInfo!: UserInfoModel;
  //   mainConfig$!: Observable<activeMainConfigModel>;
  //   mainConfig!: activeMainConfigModel;
  //   private userInfo$: Observable<UserInfoModel>;
  //   mode!: ModeModel;
  //   mode$!: Observable<ModeModel>;
  //   debitAccount: any;
  //   selectedDebitAccountType = '';
  //   lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';
  //   clientId: any;
  //   clientId$: any;
  //   connectedClient: any;
  //   plateform: any;
  //   plateform$: any;
  //   accounts: any;
  //   wallets: any;
  //   isLoading = false;
  //   debitWallet: any;
  //   defaultBank: any;
  //   selectedBank: any;
  //   selectedBank$: any;
  //   bankId$: any;
  //   bankId: any;
  //   banks: any;
  //   clientBanks: any;
  //   theme$: any;
  //   theme = '';
  //   index = 0;
  //   isBanksListShown = false;
  //   isBalanceShown = false;
  //   lookupType = '';
  //   @Output() debitOptions = new EventEmitter<{
  //       account: any;
  //       wallet: any;
  //       selectedDebitOption: any;
  //       creditAccountType: any;
  //       isTransferDone: boolean;
  //       isAmountChanging: boolean;
  //       selectedInstitutionType: string;
  //       selectedInstitution: string;
  //   }>();
  //   @Output() amount = new EventEmitter<number>();
  //   @Output() lookupOptions = new EventEmitter<{
  //       id: string;
  //       acc_holder: string;
  //       acc_number: string;
  //   }>();
  //   @Input() isTransactionDone = false;
  //   @Input() isGrey = false;
  //   @Input() title = 'Debit Account';
  //   @Input() creditAccountType = '';
  //   @Input() selectedInstitutionType = '';
  //   @Input() selectedInstitution: any;
  //   @Input() closedModal = false;
  //   @Input() isModalClosed = false;
  //   @Input() isWalletShown = true;
  //   @Input() isAccountShown = true;
  //   @Input() isTermDeposit = false;
  //   @Input() isOperation = false;
  //   @Input() isAmountChanging = false;
  //   lookup: any = new FormControl('');
  //   constructor(
  //     @Inject(BankService) private bankService: BankService,
  //     @Inject(ConfigService) private configService: ConfigService,
  //     @Inject(AuthService) private authService: AuthService,
  //   ) {
  //     this.mode$ = this.configService.getMode();
  //     this.userInfo$ = this.authService.getUserInfo();
  //     this.mainConfig$ = this.configService.getMainConfig();
  //   }
  //   ngOnInit() {
  //     this.mainConfig$.subscribe({
  //       next: configs => {
  //         this.mainConfig = configs;
  //       },
  //     });
  //     this.mode$.subscribe({
  //       next: datas => {
  //         this.mode = datas;
  //       },
  //     });
  //     this.userInfo$.subscribe({
  //       next: userinfo => {
  //         this.clientInfo = userinfo;
  //         this.clientId = this.clientInfo.client.id;
  //       },
  //     });
  //       this.clientId$
  //           .pipe(takeUntil(this.onDestroy$))
  //           .subscribe((clientId: any) => {
  //               this.clientId = clientId;
  //               this.selectedBank$
  //                   .pipe(takeUntil(this.onDestroy$))
  //                   .subscribe((selectedBank: any) => {
  //                       this.selectedBank = selectedBank;
  //                   });
  //           });
  //       if (this.closedModal === true) {
  //           this.deselectDebitAccount();
  //       }
  //       this.getBanks();
  //   }
  //   ngDoCheck() {
  //       if (this.isTransactionDone) {
  //           this.updateAccount();
  //       }
  //       if (this.isModalClosed) {
  //           const options = {
  //               account: null,
  //               wallet: null,
  //               selectedDebitOption: '',
  //               creditAccountType: null,
  //               isTransferDone: this.isTransactionDone,
  //               isAmountChanging: false,
  //               selectedInstitutionType: '',
  //               selectedInstitution: '',
  //           };
  //           this.debitOptions.emit(options);
  //           // this.isModalClosed = false;
  //       }
  //   }
  //   getAccountsListByClick() {
  //       const data = {
  //           client_id: this.clientId,
  //           access_bank_id: this.bankId,
  //       };
  //       // this.transferService
  //       //     .getAccountsList()
  //       //     .pipe(takeUntil(this.onDestroy$))
  //       //     .subscribe((accounts: any) => {
  //       //         this.accounts = accounts.objects;
  //       //         //
  //       //     });
  //   }
  //   getBanks() {
  //       this.bankService.getBanksList().subscribe((banks: any) => {
  //           this.clientBanks = banks.objects;
  //       });
  //   }
  //   getAccountsListAutomatically() {
  //       this.isTransactionDone = false;
  //       const options = {
  //           account: this.debitAccount,
  //           wallet: null,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: this.creditAccountType,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: true,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       const data = {
  //           client_id: this.clientId,
  //           access_bank_id: this.bankId,
  //       };
  //       // this.transferService
  //       //     .getAccountsList()
  //       //     .pipe(takeUntil(this.onDestroy$))
  //       //     .subscribe((accounts: any) => {
  //       //         this.accounts = accounts.objects;
  //       //         this.selectDebitAccount(this.index);
  //       //         this.isTransactionDone = false;
  //       //         this.isAmountChanging = false;
  //       //         this.bankService.updateTransaction(true);
  //       //         const options = {
  //       //             account: this.debitAccount,
  //       //             wallet: null,
  //       //             selectedDebitOption: this.selectedDebitAccountType,
  //       //             creditAccountType: this.creditAccountType,
  //       //             isTransferDone: this.isTransactionDone,
  //       //             isAmountChanging: false,
  //       //             selectedInstitutionType: this.selectedInstitutionType,
  //       //             selectedInstitution: this.selectedInstitution,
  //       //         };
  //       //         this.debitOptions.emit(options);
  //       //         //
  //       //     });
  //   }
  //   getWalletsListByClick() {
  //       // this.transferService
  //       //     .getWalletsList(this.clientId)
  //       //     .pipe(takeUntil(this.onDestroy$))
  //       //     .subscribe((wallets: any) => {
  //       //         this.wallets = wallets.objects;
  //       //         //
  //       //     });
  //   }
  //   getWalletsListAutomatically() {
  //       this.isTransactionDone = false;
  //       const options = {
  //           account: null,
  //           wallet: this.debitWallet,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: this.creditAccountType,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: true,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       // this.transferService
  //       //     .getWalletsList(this.clientId)
  //       //     .pipe(takeUntil(this.onDestroy$))
  //       //     .subscribe((wallets: any) => {
  //       //         this.wallets = wallets.objects;
  //       //         this.isAmountChanging = false;
  //       //         //
  //       //         this.selectDebitWallet(this.index);
  //       //         this.isTransactionDone = false;
  //       //         const options = {
  //       //             account: null,
  //       //             wallet: this.debitWallet,
  //       //             selectedDebitOption: this.selectedDebitAccountType,
  //       //             creditAccountType: this.creditAccountType,
  //       //             isTransferDone: this.isTransactionDone,
  //       //             isAmountChanging: false,
  //       //             selectedInstitutionType: this.selectedInstitutionType,
  //       //             selectedInstitution: this.selectedInstitution,
  //       //         };
  //       //         this.debitOptions.emit(options);
  //       //     });
  //   }
  //   selectBank(bank: any) {
  //       this.selectedBank = bank;
  //       // this.store.dispatch(
  //       //     new SelectClientBank({
  //       //         id: this.selectedBank.id,
  //       //         name: this.selectedBank.name,
  //       //         slug: this.selectedBank.slug,
  //       //         bank_type: this.selectedBank.bank_type,
  //       //         bank_code: this.selectedBank.bank_code,
  //       //         is_active: this.selectedBank.is_active,
  //       //         is_default: this.selectedBank.is_default,
  //       //         company: this.selectedBank.company,
  //       //     })
  //       // );
  //   }
  //   getClient(client: any) {
  //       this.debitAccount = client;
  //       const options = {
  //           id: this.debitAccount.id,
  //           acc_holder: this.debitAccount.lookup_title,
  //           acc_number: this.debitAccount.lookup_sub_title,
  //       };
  //       this.lookupOptions.emit(options);
  //   }
  //   selectDebitAccountType(accountType: string) {
  //       this.selectedDebitAccountType = accountType;
  //       const options = {
  //           account: null,
  //           wallet: null,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: null,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       if (accountType !== this.selectedDebitAccountType) {
  //           this.selectedDebitAccountType = '';
  //       }
  //       if (accountType == 'account') {
  //           // this.lookupType = 'lookup';
  //           if (this.plateform !== 'workStation') {
  //               this.getAccountsListByClick();
  //               this.lookupDebitAccountUrl =
  //                   '/clients/manage/accounts/object_lookup?lookup_data=';
  //           }
  //           this.debitAccount = undefined;
  //       } else if (accountType == 'wallet') {
  //           if (this.plateform !== 'workStation') {
  //               this.getWalletsListByClick();
  //           }
  //           this.lookupType = 'lookup';
  //           this.lookupDebitAccountUrl =
  //               '/dbs/wallets/object_lookup?lookup_data=';
  //           this.debitAccount = undefined;
  //       } else if (accountType == 'internal') {
  //           this.lookupType = 'autocomplete';
  //           this.lookupDebitAccountUrl = '/ledger/objects_autocomplete?search=';
  //           this.debitAccount = undefined;
  //       } else if (accountType == 'treasury') {
  //           this.lookupType = 'autocomplete';
  //           this.lookupDebitAccountUrl =
  //               '/treasury/institutions/manage/objects_autocomplete?search=';
  //           this.debitAccount = undefined;
  //       } else if (accountType == 'agent') {
  //           this.lookupType = 'lookup';
  //           this.lookupDebitAccountUrl =
  //               '/dbs/agents/object_lookup?lookup_data=';
  //           this.debitAccount = undefined;
  //       } else if (accountType == 'merchant') {
  //           this.lookupType = 'lookup';
  //           this.lookupDebitAccountUrl =
  //               '/dbs/merchant/manage/object_lookup?lookup_data=';
  //           this.debitAccount = undefined;
  //       }
  //   }
  //   deselectDebitAccount() {
  //       this.debitAccount = undefined;
  //       this.debitWallet = undefined;
  //       const options = {
  //           account: null,
  //           wallet: null,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: null,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //   }
  //   selectDebitAccount(index: number) {
  //       this.debitAccount = this.accounts[index];
  //       this.index = index;
  //       const options = {
  //           account: this.debitAccount,
  //           wallet: null,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: null,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       // console.log('selectedDebitAccount' + index, this.debitAccount);
  //   }
  //   updateAccount() {
  //       const options = {
  //           account: this.debitAccount,
  //           wallet: this.debitWallet,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: this.creditAccountType,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       if (this.selectedDebitAccountType === 'account') {
  //           this.getAccountsListAutomatically();
  //       }
  //       if (this.selectedDebitAccountType === 'wallet') {
  //           this.getWalletsListAutomatically();
  //       }
  //   }
  //   selectDebitWallet(index: number) {
  //       this.debitWallet = this.wallets[index];
  //       this.index = index;
  //       const options = {
  //           account: null,
  //           wallet: this.debitWallet,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: null,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       // console.log('selectedDebitWallet' + index, this.debitWallet);
  //   }
  //   toggleBanksList() {
  //       this.isBanksListShown = !this.isBanksListShown;
  //   }
  //   switchBank(index: any) {
  //       this.selectedBank = this.banks[index];
  //       // this.store.dispatch(
  //       //     new SelectClientBank({
  //       //         id: this.selectedBank.id,
  //       //         name: this.selectedBank.name,
  //       //         slug: this.selectedBank.slug,
  //       //         bank_type: this.selectedBank.bank_type,
  //       //         bank_code: this.selectedBank.bank_code,
  //       //         is_active: this.selectedBank.is_active,
  //       //         is_default: this.selectedBank.is_default,
  //       //         company: this.selectedBank.company,
  //       //     })
  //       // );
  //       this.selectedDebitAccountType = '';
  //       this.debitAccount = undefined;
  //       this.debitWallet = undefined;
  //   }
  //   getSwitchBankOptions(event: any) {
  //       const options = {
  //           account: null,
  //           wallet: null,
  //           selectedDebitOption: '',
  //           creditAccountType: event.creditAccountType,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //       this.selectedDebitAccountType = event.selectedDebitAccountType;
  //       this.debitAccount = event.debitAccount;
  //       this.debitWallet = event.debitWallet;
  //       this.banks = event.banks;
  //       this.accounts = event.accounts;
  //   }
  //   toggleBalance() {
  //       this.isBalanceShown = !this.isBalanceShown;
  //   }
  //   getIndividualClient(event: any) {
  //       const options = {
  //           account: event,
  //           wallet: null,
  //           selectedDebitOption: this.selectedDebitAccountType,
  //           creditAccountType: event.creditAccountType,
  //           isTransferDone: this.isTransactionDone,
  //           isAmountChanging: false,
  //           selectedInstitutionType: this.selectedInstitutionType,
  //           selectedInstitution: this.selectedInstitution,
  //       };
  //       this.debitOptions.emit(options);
  //   }
  //   getAmountOptions(event: any) {
  //       // console.log('amount from ticketing', event);
  //       this.amount.emit(event);
  //   }
  //   ngOnDestroy(): void {
  //     this.onDestroy$.next();
  //     this.onDestroy$.complete();
  //     const options = {
  //         account: null,
  //         wallet: null,
  //         selectedDebitOption: '',
  //         creditAccountType: null,
  //         isTransferDone: this.isTransactionDone,
  //         isAmountChanging: false,
  //         selectedInstitutionType: '',
  //         selectedInstitution: '',
  //     };
  //     this.debitOptions.emit(options);
  // }
}
