import {
  Component,
  effect,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';

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
import {
  ProductAutocompleteModel,
  ProductLookupBodyModel,
  ProductLookupChoiceModel,
  ProductLookupModel,
  ProductModel,
} from '../../../../components/merchant/products/products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from '../../../../components/dev/merchant-payment/merchant-products/merchant-products.component';
import { CategoryMerchantsComponent } from '../../../../components/dev/merchant-payment/category-merchants/category-merchants.component';
import { ProductCardComponent } from '../../../../components/merchant/global/product-card/product-card.component';
import { DebitAccountComponent } from '../../../../components/transfer/debit-account/debit-account.component';
import { CreditAccountComponent } from '../../../../components/transfer/credit-account/credit-account.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MetadataModel } from '../../../../components/metadatas/metadata.model';
import { SkeletonComponent } from '../../loaders/skeleton/skeleton.component';
import { BankModel } from '../../../../core/db/models/bank/bank.model';

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
    ReactiveFormsModule,
    SkeletonComponent,
  ],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent
  implements AfterViewInit, OnDestroy, OnInit
{
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

  selectedBank: BankModel | null = null;
  selectedBank$: Observable<BankModel>;
  debitAccountInfo: unknown;
  pin = '';

  merchantDetails: MerchantModel | null = null;
  loadingMerchantDetails = false;
  selectedMerchant: MerchantAutocompleteModel | null = null;

  productDetails: ProductModel | null = null;
  selectedProduct: ProductAutocompleteModel | null = null;
  loadingProductDetails = false;

  theme$!: Observable<ModeModel>;
  theme!: ModeModel;

  selectedPaymentMenu: 'Direct-Payment' | 'Product-Payment' | '' = '';

  lookupMetadataForm: FormGroup = this.fb.group({});
  metadataForm: FormGroup = this.fb.group({});

  loadingLookup = false;
  productLookup: ProductLookupModel | null = null;
  productLookupChoices: ProductLookupChoiceModel[] | null = null;
  selectedProductLookupChoice: ProductLookupChoiceModel | null = null;

  productWaitList: unknown[] = [];

  constructor(
    private dialogService: DialogService,
    private configService: ConfigService,
    private merchantService: MerchantService,
    private fb: FormBuilder
  ) {
    this.theme$ = this.configService.getMode();
    this.selectedBank$ = this.configService.getSelectedBank();

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

  ngOnInit() {
    this.selectedBank$.subscribe({
      next: bank => {
        if (bank) {
          this.selectedBank = bank;
        }
      },
    });
    if (this.type === 'merchant' && this.merchant) {
      this.getMerchantDetails(this.merchant.id);
    } else if (this.type === 'product' && this.product) {
      this.getProductDetails(this.product.id);
    }
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

          // NOTE :: SELECTE AUTO MERCHANT
          if (this.type === 'merchant') {
            const merchant = this.formatMerchantDetailsAsAutocomplete(
              this.merchantDetails
            );
            this.getSelectedMerchant(merchant);
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
    this.productDetails = null;
    this.loadingProductDetails = true;
    this.merchantService
      .getProductDetails(productId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.productDetails = response.object;
          if (this.productDetails.lookup_first) {
            this.doProductLookup();
          }
          if (this.productDetails.lookup_metadata.length !== 0) {
            this.initMetadataForm(
              this.productDetails.lookup_metadata,
              'lookup_metadata'
            );
          }
          if (this.productDetails.metadata.length !== 0) {
            this.initMetadataForm(this.productDetails.metadata, 'metadata');
          }

          // NOTE :: SELECT AUTO PRODUCT
          if (this.type === 'product') {
            const product = this.formatProductDetailsAsAutocomplete(
              this.productDetails
            );
            this.getSelectedProduct(product);
          }

          // NOTE :: GO TO PRODUCT PAYMENT AUTOMATICALLY
          if (
            !this.productDetails.lookup_metadata &&
            !this.productDetails.metadata &&
            this.productDetails.price
          ) {
            alert('Active Directly payment');
          }

          this.loadingProductDetails = false;
        },
        error: () => {
          this.loadingProductDetails = false;
        },
      });
  }

  doProductLookup() {
    this.loadingLookup = true;
    const body: ProductLookupBodyModel = {
      merchant_product_id: this.selectedProduct?.id as number,
      lookup_data: {
        ...this.lookupMetadataForm.value,
      },
      lookup_extra_data: {},
    };
    this.merchantService
      .getMerchantProductLookup(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          if (!response.object.success) {
            this.dialogService.openToast({
              message: response.object.response_message,
              title: '',
              type: 'failed',
            });
            this.loadingLookup = false;
            return;
          }
          this.lookupMetadataForm.reset();
          this.productLookup = response.object;
          if (this.productLookup.response_data?.lookup_choice) {
            this.productLookupChoices =
              this.productLookup.response_data?.lookup_choice[0]?.choices;
          }
          this.loadingLookup = false;
        },
        error: err => {
          this.dialogService.openToast({
            message:
              err?.object?.response_message ??
              $localize`Something went wrong please retry again !`,
            title: '',
            type: 'failed',
          });
          this.loadingLookup = false;
        },
      });
  }

  // submitProductPayment() {
  //   const data = {
  //     debit_bank: this.selectedBank?.id,
  //     merchant_product_id: this.selectedProduct?.id,
  //     debit_type: 'account',
  //     pin_code: this.pin,
  //     debit_account: '',
  //   };

  //   this.dialogService.dispatchLoading();

  //   this.merchantService
  //     .payMerchant(data)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: (data) => {
  //         // if (this.selectedProduct.voucher_type === 'L') {
  //         //   this.store.dispatch(
  //         //     new OpenLandscapeBillPopup(this.successMessage.data)
  //         //   );
  //         // } else {
  //         //   this.store.dispatch(
  //         //     new OpenMerchantBillPopup(this.successMessage.data)
  //         //   );
  //         // }
  //       },
  //       error: () => {},
  //     });
  // }

  closeMerchantPaymentDialog() {
    this.dialogService.closeMerchantPaymentDialog();
    this.resetAllData();
  }

  private initMetadataForm(
    metadatas: MetadataModel[],
    type: 'lookup_metadata' | 'metadata'
  ) {
    let fields: Record<string, [string, Validators[]?]> = {};

    for (const field of metadatas) {
      if (field.widget_attrs.required) {
        fields = {
          ...fields,
          [field.field_name]: [
            '',
            [
              Validators.required,
              Validators.maxLength(field.widget_attrs.max_length),
            ],
          ],
        };
      } else {
        fields = {
          ...fields,
          [field.field_name]: [
            '',
            [Validators.maxLength(field.widget_attrs.max_length)],
          ],
        };
      }
      if (type === 'lookup_metadata') {
        this.lookupMetadataForm = this.fb.group({ ...fields });
      } else if (type === 'metadata') {
        this.metadataForm = this.fb.group({ ...fields });
      }
    }
  }

  // NOTE :: GETTER AND SETTER

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
  selectProductLookupChoice(choice: ProductLookupChoiceModel) {
    this.selectedProductLookupChoice = choice;
  }

  // NOTE :: METHODS FOR RESET EACH DATA

  resetAllData() {
    this.merchant = null;
    this.product = null;
    this.category = null;
    this.merchantDetails = null;
    this.selectedMerchant = null;
    this.productDetails = null;
    this.selectedProduct = null;
    this.selectedPaymentMenu = '';
    this.lookupMetadataForm.reset();
    this.productLookup = null;
  }

  resetLookupData() {
    this.productLookup = null;
    this.resetSelectedLookupChoice();
  }
  resetSelectedLookupChoice() {
    this.selectedProductLookupChoice = null;
  }

  private formatMerchantDetailsAsAutocomplete(
    merchant: MerchantModel
  ): MerchantAutocompleteModel {
    return {
      id: Number(merchant.id),
      accepts_simple_payment: merchant.accepts_simple_payment,
      is_favorite_merchant: merchant.is_favorite_merchant,
      lookup_description: '',
      lookup_has_image_or_icon: false,
      lookup_icon: '',
      lookup_image: merchant.merchant_logo,
      lookup_subtitle: '',
      lookup_title: merchant.merchant_title,
      merchant_category_name: merchant.merchant_category.name,
    };
  }

  private formatProductDetailsAsAutocomplete(
    product: ProductModel
  ): ProductAutocompleteModel {
    return {
      id: product.id,
      is_favorite_product: product.is_favorite_product,
      lookup_description: '',
      lookup_icon: '',
      lookup_image: '',
      lookup_subtitle: '',
      lookup_title: product.name,
      price: product.price,
    };
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
