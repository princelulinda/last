import { Component, effect, AfterViewInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ConfigService, DialogService } from '../../../../core/services';
import {
  MerchantPaymentDialogModel,
  MerchantPaymentTypesModel,
} from '../../../../core/services/dialog/dialogs-models';
import { MerchantAutocompleteModel } from '../../../../components/merchant/merchant.models';
import { ProductAutocompleteModel } from '../../../../components/merchant/products/products.model';
import { CategoryModel } from '../../../../components/dashboards/dashboard.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from '../../../../components/dev/merchant-payment/merchant-products/merchant-products.component';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [CommonModule, MerchantProductsComponent],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent implements AfterViewInit {
  private merchantPaymentDialog: HTMLDialogElement | null = null;
  private paymentData: {
    active: boolean;
    payload: MerchantPaymentDialogModel | null;
  } = {
    active: false,
    payload: null,
  };
  type!: MerchantPaymentTypesModel;
  merchant: MerchantAutocompleteModel | null = null;
  product: ProductAutocompleteModel | null = null;
  category: CategoryModel | null = null;

  theme$!: Observable<ModeModel>;
  theme!: ModeModel;

  selectedSection = 'first';

  constructor(
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
    effect(() => {
      this.paymentData = this.dialogService.merchantPaymentDialog();
      if (this.paymentData.active) {
        this.merchantPaymentDialog?.showModal();
      } else {
        this.merchantPaymentDialog?.close();
      }
    });
  }

  ngAfterViewInit() {
    this.merchantPaymentDialog = document.getElementById(
      'merchant-payment'
    ) as HTMLDialogElement;
  }
}
