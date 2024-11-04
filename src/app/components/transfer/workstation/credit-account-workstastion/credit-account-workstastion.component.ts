import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { ConfigService } from '../../../../core/services';
import { ActiveMainConfigModel } from '../../../../core/services/config/main-config.models';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';
import { LookupIndividualComponent } from '../../../dev/lookup-individual/lookup-individual.component';

import { ClientInfoModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { LookupModel } from '../../../../global/models/global.models';
import { TransferService } from '../../../../core/services/transfer/transfer.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TransferResponseModel } from '../../transfer.model';
import { DialogService } from '../../../../core/services';

@Component({
  selector: 'app-credit-account-workstastion',
  standalone: true,
  imports: [
    CommonModule,
    LookupComponent,
    LookupIndividualComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './credit-account-workstastion.component.html',
  styleUrl: './credit-account-workstastion.component.scss',
})
export class CreditAccountWorkstastionComponent implements OnInit, OnDestroy {
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  // wallet information

  lookupWallet: FormControl = new FormControl('');
  walletSearching = false;
  walletNumber: string | undefined;
  walletName: string | undefined;
  mainConfig!: ActiveMainConfigModel;
  lookupCreditAccountUrl = '/clients/list/all/object_lookup?lookup_data=';

  creditAccount!: LookupModel | null;
  individualClientInfo: ClientInfoModel | null = null;

  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() selectedCreditAccountType = '';

  @Output() lookupOptions = new EventEmitter<LookupModel | null>();
  @Output() lookupOptionsWallet = new EventEmitter<TransferResponseModel>();
  @Output() selectedCreditAccountTypeChange = new EventEmitter<string>();
  @Output() deselectAccount = new EventEmitter<boolean>(false);
  constructor(
    private configService: ConfigService,
    private transferService: TransferService,
    private dialogService: DialogService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }
  selectCreditAccountType(accountType: string) {
    this.selectedCreditAccountType = accountType;
    this.selectedCreditAccountTypeChange.emit(this.selectedCreditAccountType);
    this.deselectAccount.emit(true);
    if (accountType !== this.selectedCreditAccountType) {
      this.selectedCreditAccountType = '';
    }
    switch (accountType) {
      case 'account':
        this.creditAccount = null;
        break;

      case 'wallet':
        this.lookupCreditAccountUrl = '/dbs/wallets/object_lookup?lookup_data=';
        this.creditAccount = null;
        break;

      case 'agent':
        this.lookupCreditAccountUrl = '/dbs/agents/object_lookup?lookup_data=';
        this.creditAccount = null;
        break;

      case 'internal':
        this.lookupCreditAccountUrl = '/ledger/objects_autocomplete?search=';
        this.creditAccount = null;
        break;
      case 'treasury':
        this.lookupCreditAccountUrl =
          '/treasury/institutions/manage/objects_autocomplete?search=';
        this.creditAccount = null;
        break;

      case 'merchant':
        this.lookupCreditAccountUrl =
          '/dbs/merchant/manage/object_lookup?lookup_data=';
        this.creditAccount = null;
        break;

      default:
        break;
    }
  }

  getIndividualClient(event: ClientInfoModel) {
    this.individualClientInfo = event;
  }
  getClientToCredit(client: LookupModel | null) {
    this.creditAccount = client;

    //console.log('helllooo' , this.debitAccount)
    this.lookupOptions.emit(this.creditAccount);
  }

  deselectDebitAccount() {
    this.walletName = undefined;
    this.walletNumber = undefined;
    this.deselectAccount.emit(true);
  }

  lookupAccount() {
    this.walletSearching = true;

    const dataWallet = {
      account_number: this.lookupWallet.value,
      bank_slug: 'MF1-0001',
      account_type: 'wallet',
    };
    return this.transferService
      .lookupAccount(dataWallet)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: TransferResponseModel) => {
          this.walletSearching = false;
          if (response.object.success === true) {
            this.walletName = response.object.response_data.name;
            this.walletNumber = response.object.response_data.account_number;

            this.lookupOptionsWallet.emit(response);

            this.lookupWallet.reset();
          }

          if (response.object.success === false) {
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message,
            });
          }
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: 'failed',
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
