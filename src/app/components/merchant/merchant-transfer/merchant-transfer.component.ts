import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransferComponent } from '../../transfer/transfer/transfer.component';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';
import { ConfigService, MerchantService } from '../../../core/services';
import { DialogService } from '../../../core/services';
import { Location } from '@angular/common';
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
import { MerchantModel } from '../merchant.models';
import { ConnectedOperatorModel } from '../../auth/auth.model';
import { CreditAccountComponent } from '../../transfer/banking/credit-account/credit-account.component';
import { TransferService } from '../../../core/services/transfer/transfer.service';
import { ActiveMainConfigModel } from '../../../core/services/config/main-config.models';
@Component({
  selector: 'app-merchant-transfer',
  standalone: true,
  imports: [TransferComponent, NotFoundPageComponent, CreditAccountComponent],
  templateUrl: './merchant-transfer.component.html',
  styleUrl: './merchant-transfer.component.scss',
})
export class MerchantTransferComponent implements OnInit, OnDestroy {
  merchantInfo: MerchantModel | null = null;
  institutionId: ConnectedOperatorModel | number | undefined;
  institutionId$!: Observable<ConnectedOperatorModel>;
  selectedCreditAccountForm:
    | {
        accountNumber: string;
        accountHolder: string;
        debit_description: string;
        amount: number;
        merchant_reference?: string;
      }
    | undefined;

  selectedInstitution!: InstitutionInfoModel;
  selectedCreditAccountType!: string;
  dialogState$!: Observable<DialogResponseModel>;
  mainConfig$: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;
  pin!: string;

  private onDestroy$ = new Subject<void>();
  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private location: Location,
    private configService: ConfigService,
    private transferService: TransferService
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.institutionId$ = this.configService.getConnectedOperator();
    this.mainConfig$ = this.configService.getMainConfig();
  }
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });

    this.institutionId$.subscribe({
      next: datas => {
        this.institutionId = datas.organization?.id;
      },
    });

    this.getConnectedMerchantInfo();

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        if (dialogResponse.action === 'pin' && dialogResponse.response.pin) {
          this.pin = dialogResponse.response.pin;
          if (this.mainConfig.activePlateform !== 'workstation') {
            this.doMerchantPayment();
          }
          if (this.mainConfig.activePlateform === 'workstation') {
            this.doMerchantPaymentWs();
          }
        }
      },
    });
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe({
      next: response => {
        if (response.object.success) {
          this.merchantInfo = response.object.response_data;
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
  goBack(): void {
    this.location.back();
  }
  handleSelectedCreditAccount(event: SelectedCreditAccountEventModel) {
    this.selectedCreditAccountForm = event.transferForm;
    // console.log('selectedCreditAccountForm', this.selectedCreditAccountForm);
    this.selectedInstitution = event.selectedInstitution;
    this.selectedCreditAccountType = event.selectedCreditAccountType;

    this.openPinPopup();
  }

  doMerchantPayment() {
    this.dialogService.dispatchLoading();
    // this.loading = true;
    if (this.selectedCreditAccountForm) {
      const body: DoMerchantTransferModel = {
        amount: this.selectedCreditAccountForm.amount,
        credit_account: this.selectedCreditAccountForm.accountNumber,
        credit_account_holder: this.selectedCreditAccountForm.accountHolder,
        credit_bank: this.selectedInstitution.slug,
        credit_type: this.selectedCreditAccountType,
        pin_code: this.pin,
        description: this.selectedCreditAccountForm.debit_description,
        merchant_reference: this.selectedCreditAccountForm.merchant_reference,
      };

      this.merchantService
        .MerchantPayment(body)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (response: DoMerchantTransferResponseModel) => {
            // this.loading = false;
            this.dialogService.closeLoading();
            if (response.object.success) {
              this.dialogService.openToast({
                type: 'success',
                title: 'Succès',
                message: response.object.response_message,
              });
            } else {
              this.dialogService.openToast({
                type: 'failed',
                title: 'Échec',
                message: response.object.response_message,
              });
            }
          },
          error: () => {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'failed',
            });
          },
        });
    }
  }

  doMerchantPaymentWs() {
    this.dialogService.dispatchLoading();
    // this.loading = true;
    if (this.selectedCreditAccountForm) {
      const data = {
        transfer_type: 'send',
        amount: this.selectedCreditAccountForm.amount,
        debit_type: 'merchant',
        credit_account: this.selectedCreditAccountForm.accountNumber,
        credit_account_holder: this.selectedCreditAccountForm.accountHolder,
        credit_bank: this.selectedInstitution.slug,
        credit_type: this.selectedCreditAccountType,
        pin_code: this.pin,
        description: this.selectedCreditAccountForm.debit_description,
        merchant_reference: this.selectedCreditAccountForm.merchant_reference,
      };
      this.transferService
        .doTransferWorkstation(this.institutionId, data)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (response: DoMerchantTransferResponseModel) => {
            // this.loading = false;
            this.dialogService.closeLoading();
            if (response.object.success) {
              this.dialogService.openToast({
                type: 'success',
                title: 'Succès',
                message: response.object.response_message,
              });
            } else {
              this.dialogService.openToast({
                type: 'failed',
                title: 'Échec',
                message: response.object.response_message,
              });
            }
          },
          error: () => {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'failed',
            });
          },
        });
    }
  }
  openPinPopup() {
    if (this.selectedCreditAccountForm) {
      this.dialogService.openDialog({
        type: 'pin',
        title: 'Enter your PIN code',
        //message: 'Please enter your PIN code to continue.',
        action: 'pin',
        message: ` Confirm your transfer of <b>${this.selectedCreditAccountForm.amount} BIF
      </b> for the benefit of <b>${this.selectedCreditAccountForm.accountHolder} 
      <small>${this.selectedCreditAccountForm.accountNumber}</small></b> `,
      });
    }
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
