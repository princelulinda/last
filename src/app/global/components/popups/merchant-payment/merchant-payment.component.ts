import { Component, effect, AfterViewInit } from '@angular/core';
import { DialogService } from '../../../../core/services';
import { MerchantPaymentDialogModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent implements AfterViewInit {
  paymentData: { active: boolean; payload: MerchantPaymentDialogModel | null } =
    {
      active: false,
      payload: null,
    };
  merchantPaymentDialog: HTMLDialogElement | null = null;

  constructor(private dialogService: DialogService) {
    effect(() => {
      this.paymentData = this.dialogService.merchantPaymentDialog();
    });
  }

  ngAfterViewInit() {
    this.merchantPaymentDialog = document.getElementById(
      'merchant-payment'
    ) as HTMLDialogElement;
  }
}
