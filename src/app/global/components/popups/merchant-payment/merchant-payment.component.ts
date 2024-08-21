import { Component, effect, AfterViewInit, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ConfigService, DialogService } from '../../../../core/services';
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
export class MerchantPaymentComponent implements AfterViewInit, OnInit {
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

  selectedMerchant: MerchantAutocompleteModel | null = null;

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
        this.type = this.paymentData.payload?.type as MerchantPaymentTypesModel;
        this.merchant = this.paymentData.payload?.merchant ?? null;
        this.category = this.paymentData.payload?.category ?? null;
        this.product = this.paymentData.payload?.product ?? null;
      } else {
        this.merchantPaymentDialog?.close();
      }
    });
  }

  ngOnInit() {
    console.log('adsadada', this.category, this.type);
  }

  closeMerchantPaymentDialog() {
    this.dialogService.closeMerchantPaymentDialog();
  }

  getSelectedMerchant(merchant: MerchantAutocompleteModel) {
    this.selectedMerchant = merchant;
  }

  ngAfterViewInit() {
    this.merchantPaymentDialog = document.getElementById(
      'merchant-payment'
    ) as HTMLDialogElement;
  }
}
