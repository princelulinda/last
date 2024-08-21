import { Component, effect, AfterViewInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../../core/services';
import {
  MerchantPaymentDialogModel,
  MerchantPaymentTypesModel,
} from '../../../../core/services/dialog/dialogs-models';
import {
  MerchantAutocompleteModel,
  MerchantCategoriesModel,
} from '../../../../components/merchant/merchant.models';
import { ProductAutocompleteModel } from '../../../../components/merchant/products/products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from '../../../../components/dev/merchant-payment/merchant-products/merchant-products.component';
import { CategoryMerchantsComponent } from '../../../../components/dev/merchant-payment/category-merchants/category-merchants.component';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [
    CommonModule,
    MerchantProductsComponent,
    CategoryMerchantsComponent,
  ],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent implements AfterViewInit {
  private merchantPaymentDialog: HTMLDialogElement | null = null;
  paymentData: {
    active: boolean;
    payload: MerchantPaymentDialogModel | null;
  } = {
    active: false,
    payload: null,
  };
  type!: MerchantPaymentTypesModel;
  merchant: MerchantAutocompleteModel | null = null;
  product: ProductAutocompleteModel | null = null;
  category: MerchantCategoriesModel | null = null;

  // merchantDetails: any;
  loadingMerchantDetails = false;

  selectedMerchant: MerchantAutocompleteModel | null = null;
  selectedProduct: ProductAutocompleteModel | null = null;

  theme$!: Observable<ModeModel>;
  theme!: ModeModel;

  selectedPaymentMenu: 'Direct-Payment' | 'Product-Payment' | '' = '';

  constructor(
    private dialogService: DialogService,
    private configService: ConfigService,
    private merchantService: MerchantService
  ) {
    this.theme$ = this.configService.getMode();

    // NOTE :: SIGNAL CHECK CHANGES
    effect(() => {
      this.paymentData = this.dialogService.merchantPaymentDialog();
      if (this.paymentData.active) {
        this.merchantPaymentDialog?.showModal();
        this.type = this.paymentData.payload?.type as MerchantPaymentTypesModel;
        this.merchant = this.paymentData.payload?.merchant ?? null;
        this.category = this.paymentData.payload?.category ?? null;
        this.product = this.paymentData.payload?.product ?? null;
      } else {
        this.merchantPaymentDialog?.close();
      }
    });
  }

  getMerchantDetails(merchantId: number) {
    this.loadingMerchantDetails = true;
    this.merchantService.getMerchantsDetails(merchantId).subscribe({
      next: () => {
        this.loadingMerchantDetails = false;
      },
      error: () => {
        this.loadingMerchantDetails = false;
      },
    });
  }

  closeMerchantPaymentDialog() {
    this.dialogService.closeMerchantPaymentDialog();
  }
  getSelectedMerchant(merchant: MerchantAutocompleteModel) {
    this.selectedMerchant = merchant;
    this.getMerchantDetails(merchant.id);
  }
  selectPaymentMenu(type: 'Direct-Payment' | 'Product-Payment' | '') {
    this.selectedPaymentMenu = type;
  }

  ngAfterViewInit() {
    this.merchantPaymentDialog = document.getElementById(
      'merchant-payment'
    ) as HTMLDialogElement;
  }
}
