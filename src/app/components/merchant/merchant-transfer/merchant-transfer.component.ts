import { Component, OnInit } from '@angular/core';
import { TransferComponent } from '../../transfer/transfer/transfer.component';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';
import { MerchantService } from '../../../core/services';
import { MerchantObjectModel } from '../products/products.model';
import { DialogService } from '../../../core/services';
import { CreditAccountComponent } from '../../transfer/credit-account/credit-account.component';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-merchant-transfer',
  standalone: true,
  imports: [TransferComponent, NotFoundPageComponent, CreditAccountComponent],
  templateUrl: './merchant-transfer.component.html',
  styleUrl: './merchant-transfer.component.scss',
})
export class MerchantTransferComponent implements OnInit {
  merchantInfo: MerchantObjectModel | null = null;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {}
  ngOnInit(): void {
    this.getConnectedMerchantInfo();
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

  onCreditAccountSelected(creditAccountForm: FormGroup) {
    // Ici, vous pouvez traiter les données du formulaire du compte de crédit sélectionné
    console.log('Credit account form:', creditAccountForm.value);
  }
}
