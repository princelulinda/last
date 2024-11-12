import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { ConfigService } from '../../../../core/services';
import { ActiveMainConfigModel } from '../../../../core/services/config/main-config.models';
import { LookupComponent } from '../../../../global/components/lookups/lookup/lookup.component';

import { ClientInfoModel } from '../../../../global/components/lookups/lookup/lookup.model';
import { LookupModel } from '../../../../global/models/global.models';
import { TransferService } from '../../../../core/services/transfer/transfer.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TransferResponseModel } from '../../transfer.model';
import { DialogService } from '../../../../core/services';
import { LookupIndividualComponent } from '../../../../global/components/custom-field/lookup-individual/lookup-individual.component';

@Component({
  selector: 'app-debit-account-workstation',
  standalone: true,
  imports: [
    CommonModule,
    LookupComponent,
    LookupIndividualComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './debit-account-workstation.component.html',
  styleUrl: './debit-account-workstation.component.scss',
})
export class DebitAccountWorkstationComponent implements OnInit {
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<ActiveMainConfigModel>;
  // wallet information

  lookupWallet: FormControl = new FormControl('');
  walletSearching = false;
  walletNumber: string | undefined;
  walletName: string | undefined;
  mainConfig!: ActiveMainConfigModel;
  lookupDebitAccountUrl = '/clients/list/all/object_lookup?lookup_data=';

  debitAccount!: LookupModel | null;
  individualClientInfo: ClientInfoModel | null = null;

  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() selectedDebitAccountType = '';

  @Output() lookupOptions = new EventEmitter<LookupModel | null>();
  @Output() lookupOptionsWallet = new EventEmitter<TransferResponseModel>();
  @Output() selectedDebitAccountTypeChange = new EventEmitter<string>();
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
  selectDebitAccountType(accountType: string) {
    this.selectedDebitAccountType = accountType;
    this.selectedDebitAccountTypeChange.emit(this.selectedDebitAccountType);
    this.deselectAccount.emit(true);
    if (accountType !== this.selectedDebitAccountType) {
      this.selectedDebitAccountType = '';
    }
    switch (accountType) {
      case 'account':
        this.debitAccount = null;
        break;

      case 'wallet':
        this.lookupDebitAccountUrl = '/dbs/wallets/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      case 'agent':
        this.lookupDebitAccountUrl = '/dbs/agents/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      case 'internal':
        this.lookupDebitAccountUrl = '/ledger/objects_autocomplete?search=';
        this.debitAccount = null;
        break;

      case 'treasury':
        this.lookupDebitAccountUrl =
          '/treasury/institutions/manage/objects_autocomplete?search=';
        this.debitAccount = null;
        break;

      case 'merchant':
        this.lookupDebitAccountUrl =
          '/dbs/merchant/manage/object_lookup?lookup_data=';
        this.debitAccount = null;
        break;

      default:
        break;
    }
  }
  getIndividualClient(event: ClientInfoModel) {
    this.individualClientInfo = event;
  }

  getClientToDebit(client: LookupModel | null) {
    this.debitAccount = client;

    //console.log('helllooo' , this.debitAccount)
    this.lookupOptions.emit(this.debitAccount);
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
}
