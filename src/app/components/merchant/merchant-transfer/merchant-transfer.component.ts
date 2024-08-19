import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferComponent } from '../../transfer/transfer/transfer.component';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';
import { MerchantService } from '../../../core/services';
import { MerchantObjectModel } from '../products/products.model';
import { DialogService } from '../../../core/services';
import { CreditAccountComponent } from '../../transfer/credit-account/credit-account.component';

import {
  InstitutionInfoModel,
  SelectedCreditAccountEventModel,
} from '../../transfer/transfer.model';
import {
  DoMerchantTransferModel,
  DoMerchantTransferResponseModel,
} from './merchant-transfer.models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
@Component({
  selector: 'app-merchant-transfer',
  standalone: true,
  imports: [TransferComponent, NotFoundPageComponent, CreditAccountComponent],
  templateUrl: './merchant-transfer.component.html',
  styleUrl: './merchant-transfer.component.scss',
})
export class MerchantTransferComponent implements OnInit, OnDestroy {
  merchantInfo: MerchantObjectModel | null = null;
  selectedCreditAccountForm:
    | {
        accountNumber: string;
        accountHolder: string;
        debit_description: string;
        amount: number;
      }
    | undefined;
  selectedInstitution!: InstitutionInfoModel;
  selectedCreditAccountType!: string;
  dialogState$!: Observable<DialogResponseModel>;
  pin!: string;

  private onDestroy$ = new Subject<void>();
  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
  }
  ngOnInit(): void {
    this.getConnectedMerchantInfo();

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        console.log('PIN reçu:', this.pin);
        if (dialogResponse.action === 'pin' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          this.doMerchantPayment();
        }
      },
    });
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe({
      next: (merchantInfo: MerchantObjectModel) => {
        if (merchantInfo.object.success) {
          this.merchantInfo = merchantInfo;
          // console.log ('merchant infoo', this.merchantInfo )
        } else {
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: $localize`Something went wrong, please retry again`,
          });
        }
      },
      error: () => {
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: $localize`An error occurred, please try again`,
        });
      },
    });
  }

  handleSelectedCreditAccount(event: SelectedCreditAccountEventModel) {
    this.selectedCreditAccountForm = event.transferForm;
    this.selectedInstitution = event.selectedInstitution;
    this.selectedCreditAccountType = event.selectedCreditAccountType;
    // console.log('Credit account form:', this.selectedCreditAccountForm);
    // console.log('Selected institution:', this.selectedInstitution);
    // console.log('Selected credit account type:', this.selectedCreditAccountType);
    // console.log('Selected Credit Account Event:', event);
    // Ici, vous pouvez traiter les données reçues de l'événement
    this.openPinPopup();
  }

  doMerchantPayment() {
    this.dialogService.dispatchLoading();
    // this.loading = true;

    const body: DoMerchantTransferModel = {
      amount: '2000',
      credit_account: 'hela',
      credit_account_holder: 'pierre',
      credit_bank: this.selectedInstitution.slug,
      credit_type: this.selectedCreditAccountType,
      pin_code: 1234,
      description: 'perso',
      merchant_reference: '',
    };

    this.merchantService
      .doMerchantPaymeny(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: DoMerchantTransferResponseModel) => {
          // this.loading = false;
          this.dialogService.closeLoading();
          if (response.object.success) {
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: 'Le paiement a été effectué avec succès.',
            });
          } else {
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'Le paiement a échoué.',
            });
          }
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: 'Le paiement a échoué, veuillez réessayer.',
          });
        },
      });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: 'pin',
    });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
