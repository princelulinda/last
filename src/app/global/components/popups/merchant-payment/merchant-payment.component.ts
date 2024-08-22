import { Component, effect, AfterViewInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

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
  MerchantModel,
} from '../../../../components/merchant/merchant.models';
import { ProductAutocompleteModel } from '../../../../components/merchant/products/products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from '../../../../components/dev/merchant-payment/merchant-products/merchant-products.component';
import { CategoryMerchantsComponent } from '../../../../components/dev/merchant-payment/category-merchants/category-merchants.component';
import { ProductCardComponent } from '../../../../components/merchant/global/product-card/product-card.component';
import { DebitAccountComponent } from '../../../../components/transfer/debit-account/debit-account.component';
import { CreditAccountComponent } from '../../../../components/transfer/credit-account/credit-account.component';
import { LookupComponent } from '../../lookups/lookup/lookup.component';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [
    CommonModule,
    MerchantProductsComponent,
    CategoryMerchantsComponent,
    ProductCardComponent,
    DebitAccountComponent,
    CreditAccountComponent,
    LookupComponent,
  ],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent implements AfterViewInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

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

  merchantDetails: MerchantModel | null = null;
  loadingMerchantDetails = false;
  selectedMerchant: MerchantAutocompleteModel | null = null;

  productDetails: unknown | null = null;
  selectedProduct: ProductAutocompleteModel | null = null;
  loadingProductDetails = false;

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
    this.merchantDetails = null;
    this.loadingMerchantDetails = true;
    this.merchantService
      .getMerchantsDetails(merchantId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.merchantDetails = response.object;
          if (!this.merchantDetails.accepts_simple_payment) {
            this.selectedPaymentMenu = 'Product-Payment';
          }
          this.loadingMerchantDetails = false;
        },
        error: err => {
          this.dialogService.openToast({
            message:
              err?.object?.response_message ??
              $localize`Something went wrong please retry again !`,
            title: '',
            type: 'failed',
          });
          this.loadingMerchantDetails = false;
        },
      });
  }

  getProductDetails(productId: number) {
    this.merchantService
      .getProductDetails(productId)
      .pipe(takeUntil(this.onDestroy$));
    // .subscribe({
    //   next: () => {},
    //   error: () => {},
    // });
  }

  closeMerchantPaymentDialog() {
    this.dialogService.closeMerchantPaymentDialog();
  }
  getSelectedMerchant(merchant: MerchantAutocompleteModel) {
    this.selectedMerchant = merchant;
    this.getMerchantDetails(merchant.id);
  }
  getSelectedProduct(product: ProductAutocompleteModel) {
    this.selectedProduct = product;
    this.getProductDetails(product.id);
  }

  selectPaymentMenu(type: 'Direct-Payment' | 'Product-Payment' | '') {
    this.selectedPaymentMenu = type;
  }

  ngAfterViewInit() {
    this.merchantPaymentDialog = document.getElementById(
      'merchant-payment'
    ) as HTMLDialogElement;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
