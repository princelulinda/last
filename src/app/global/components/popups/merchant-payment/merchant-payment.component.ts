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
  DialogResponseModel,
  LandscpeBillModel,
  MerchantBillModel,
  MerchantPaymentDialogModel,
  MerchantPaymentTypesModel,
} from '../../../../core/services/dialog/dialogs-models';
import {
  BillersAutocompleteModel,
  MerchantAutocompleteModel,
  MerchantCategoriesAutocompleteModel,
  MerchantModel,
  MerchantSimplePaymentBodyModel,
  MerchantSimplePaymentResponseModel,
  PayMerchantBodyModel,
  PayMerchantResponseModel,
} from '../../../../components/merchant/merchant.models';
import {
  ProductAutocompleteModel,
  ProductLookupBodyModel,
  ProductLookupChoiceModel,
  ProductLookupModel,
  ProductModel,
} from '../../../../components/merchant/products/products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from '../merchant-payment/merchant-products/merchant-products.component';
import { CategoryMerchantsComponent } from '../merchant-payment/category-merchants/category-merchants.component';
import { ProductCardComponent } from '../../../../components/merchant/global/product-card/product-card.component';
import { DebitAccountComponent } from '../../../../components/transfer/banking/debit-account/debit-account.component';
import { CreditAccountComponent } from '../../../../components/transfer/credit-account/credit-account.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MetadataModel } from '../../../../components/metadatas/metadata.model';
import { SkeletonComponent } from '../../loaders/skeleton/skeleton.component';
import { BankModel } from '../../../../core/db/models/bank/bank.model';
import { AccountsListModel } from '../../../../components/account/models';
import { WalletList } from '../../../../components/wallet/wallet.models';
import { AmountFieldComponent } from '../../custom-field/amount-field/amount-field.component';
import { LookupComponent } from '../../lookups/lookup/lookup.component';
import { AutocompleteModel } from '../../../models/global.models';

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
    AmountFieldComponent,
    LookupComponent,
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
  merchant: MerchantAutocompleteModel | BillersAutocompleteModel | null = null;
  product: ProductAutocompleteModel | null = null;
  category: MerchantCategoriesAutocompleteModel | null = null;
  steps: 'first' | 'second' = 'first';

  selectedBank: BankModel | null = null;
  selectedBank$: Observable<BankModel>;
  debitAccountInfo: unknown;
  pin = '';

  merchantDetails: MerchantModel | null = null;
  loadingMerchantDetails = false;
  selectedMerchant:
    | MerchantAutocompleteModel
    | BillersAutocompleteModel
    | null = null;

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

  productWaitList: {
    lookup_metata: {
      lookup: ProductLookupModel | null;
      choice: ProductLookupChoiceModel | null;
      values: Record<string, string>;
    };
    metadata: Record<string, string>;
  }[] = [];

  dialog$: Observable<DialogResponseModel>;

  debitAccount: AccountsListModel | null = null;
  debitWallet: WalletList | null = null;

  simplePaymentForm = this.fb.group({
    amount: ['', Validators.required],
    description: ['', Validators.required],
  });

  activeTipControl = new FormControl(false);
  tipLevelControl = new FormControl('', Validators.required);
  tipAmount = 0;
  selectedTipWaiterId: number | null = null;

  constructor(
    private dialogService: DialogService,
    private configService: ConfigService,
    private merchantService: MerchantService,
    private fb: FormBuilder
  ) {
    this.theme$ = this.configService.getMode();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.dialog$ = this.dialogService.getDialogState();

    // NOTE :: SIGNAL CHECK CHANGES
    effect(() => {
      this.paymentData = this.dialogService.merchantPaymentDialog();
      if (this.paymentData.active) {
        this.merchantPaymentDialog?.showModal();
        this.type = this.paymentData.payload?.type as MerchantPaymentTypesModel;
        this.merchant = this.paymentData.payload?.merchant ?? null;
        this.category = this.paymentData.payload?.category ?? null;
        this.product = this.paymentData.payload?.product ?? null;

        if (this.type === 'merchant' && this.merchant) {
          this.getSelectedMerchant(this.merchant);
        } else if (this.type === 'product' && this.product) {
          this.getSelectedProduct(this.product);
        }
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

    this.dialog$.subscribe({
      next: dialog => {
        if (dialog && dialog.action === 'Merchant Product Payment') {
          this.pin = dialog.response.pin;
          this.submitProductPayment();
        } else if (dialog && dialog.action === 'Merchant Simple Payment') {
          this.pin = dialog.response.pin;
          this.submitSimplePayment();
        }
      },
    });

    this.activeTipControl.valueChanges.subscribe({
      next: () => {
        this.tipLevelControl.reset();
      },
    });
  }

  private getMerchantDetails(merchantId: number) {
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

  private getProductDetails(productId: number) {
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

          // NOTE :: SELECT AUTO MERCHANT
          if (this.type === 'product') {
            const merchant = this.formatMerchantDetailsAsAutocomplete(
              this.productDetails.merchant
            );
            this.getSelectedMerchant(merchant);
          }

          // NOTE :: GO TO PRODUCT PAYMENT AUTOMATICALLY
          if (
            this.productDetails.lookup_metadata.length === 0 &&
            this.productDetails.metadata.length === 0 &&
            this.productDetails.price
          ) {
            let type: 'multiple' | 'simple';
            if (this.productDetails.accepts_multiple_payment) {
              type = 'multiple';
            } else {
              type = 'simple';
            }
            this.addProductToWaitList(type);

            this.selectedPaymentMenu = 'Product-Payment';
            this.steps = 'second';
          }

          this.loadingProductDetails = false;
        },
        error: () => {
          this.loadingProductDetails = false;
        },
      });
  }

  addProductToWaitList(type: 'simple' | 'multiple' = 'simple') {
    if (type === 'simple') {
      this.productWaitList.push({
        lookup_metata: {
          choice: this.selectedProductLookupChoice,
          lookup: this.productLookup,
          values: this.lookupMetadataForm.value,
        },
        metadata: this.metadataForm.value,
      });
      this.steps = 'second';
    } else {
      this.productWaitList.push({
        lookup_metata: {
          choice: this.selectedProductLookupChoice,
          lookup: this.productLookup,
          values: this.lookupMetadataForm.value,
        },
        metadata: this.metadataForm.value,
      });
      this.resetLookupData();
    }
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

  openPaymentPinPopup() {
    let action = '';
    if (this.selectedPaymentMenu === 'Direct-Payment') {
      action = 'Merchant Simple Payment';
    } else {
      action = 'Merchant Product Payment';
    }
    this.dialogService.openDialog({
      action: action,
      message: 'Please enter your PIN',
      title: '',
      type: 'pin',
    });
  }

  submitProductPayment() {
    const paymentDetails: {
      payment_data?: Record<string, string>;
      lookup_data?: Record<string, string>;
    }[] = [];
    let data: PayMerchantBodyModel = {
      debit_bank: Number(this.selectedBank?.id),
      merchant_product_id: Number(this.selectedProduct?.id),
      debit_type: '',
      pin_code: this.pin,
      debit_account: '',
      debit_account_holder: '',
    };

    if (this.debitAccount) {
      data.debit_type = 'account';
      data.debit_account = this.debitAccount.acc_number.toString();
      data.debit_account_holder = this.debitAccount.acc_holder;
    } else if (this.debitWallet) {
      data.debit_type = 'wallet';
      data.debit_account = this.debitWallet.code;
      data.debit_account_holder = this.debitWallet.account.account_holder;
    }

    if (
      this.productWaitList.length > 1 &&
      this.productDetails?.accepts_multiple_payment
    ) {
      for (const item of this.productWaitList) {
        paymentDetails.push({
          lookup_data: item.lookup_metata.values,
          payment_data: item.metadata,
        });
      }
      data = {
        ...data,
        is_multiple_payment: true,
        payment_details: paymentDetails,
      };
    } else {
      data = {
        ...data,
        payment_data: { ...this.productWaitList[0].metadata },
        lookup_data: { ...this.productWaitList[0].lookup_metata.values },
      };
    }

    this.dialogService.dispatchLoading();

    this.merchantService
      .payMerchant(data)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.dialogService.closeLoading();
          if (data.object['success'] !== undefined && !data.object.success) {
            this.dialogService.openToast({
              message:
                data.object.response_message ??
                $localize`Something went wrong please retry again !`,
              title: '',
              type: 'failed',
            });
            return;
          }
          this.resetAllData();
          this.dialogService.closeMerchantPaymentDialog();
          this.manageMerchantBill(data.object);
        },
        error: err => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            message:
              err?.object?.response_message ??
              $localize`Something went wrong please retry again !`,
            title: '',
            type: 'failed',
          });
        },
      });
  }

  submitSimplePayment() {
    let debit_account = '';
    let debit_type = '';

    if (this.debitAccount) {
      debit_account = this.debitAccount?.acc_number.toString();
      debit_type = 'account';
    } else if (this.debitWallet) {
      debit_account = this.debitWallet?.account.account_holder;
      debit_type = 'wallet';
    }

    this.dialogService.dispatchLoading();
    let body: MerchantSimplePaymentBodyModel = {
      amount: this.simplePaymentForm.value.amount as string,
      debit_account: debit_account,
      debit_bank: Number(this.selectedBank?.id),
      debit_type: debit_type,
      description: this.simplePaymentForm.value.description as string,
      merchant_id: Number(this.selectedMerchant?.id.toString()),
      pin_code: this.pin,
    };

    // NOTE :: ON SIMPLE PAYMENT AND TIP
    if (this.activeTipControl.value && this.selectedTipWaiterId) {
      const custom_tip_amount =
        this.tipLevelControl.value === 'other' ? this.tipAmount : 0;
      body = {
        ...body,
        give_tip: true,
        merchant_teller_id: this.selectedTipWaiterId,
        tip_level: this.tipLevelControl?.value ?? '',
        custom_tip_amount: custom_tip_amount,
      };
    }

    this.merchantService
      .doMerchantSimplePayment(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          if (!response.object.success) {
            this.dialogService.openToast({
              message:
                response?.object?.response_message ??
                'Something went wrong please retry again !',
              title: '',
              type: 'failed',
            });
            return;
          }
          this.dialogService.closeLoading();
          this.resetAllData();
          this.dialogService.closeMerchantPaymentDialog();
          this.manageSimplePaymentMerchantBill(response.object);
        },
        error: err => {
          this.dialogService.openToast({
            message:
              err?.object?.response_message ??
              'Something went wrong please retry again !',
            title: '',
            type: 'failed',
          });
        },
      });
  }

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

  getSelectedTipWaiter(waiter: AutocompleteModel | null) {
    if (waiter) {
      this.selectedTipWaiterId = waiter.id;
    } else {
      this.selectedTipWaiterId = null;
    }
  }

  getAmount(
    data: { amount: number | null },
    type: 'simple-payment' | 'tip' = 'simple-payment'
  ) {
    if (data.amount) {
      if (type === 'simple-payment') {
        this.simplePaymentForm.setValue({
          amount: data.amount.toString(),
          description: this.simplePaymentForm.value.description ?? '',
        });
      } else {
        this.tipAmount = data.amount;
      }
    }
  }

  getDebitAccount(
    data: AccountsListModel | WalletList | null,
    type: 'wallet' | 'account'
  ) {
    if (type === 'wallet') {
      this.debitAccount = null;
      this.debitWallet = data as WalletList;
    } else if (type === 'account') {
      this.debitWallet = null;
      this.debitAccount = data as AccountsListModel;
    }
  }

  getSelectedMerchant(
    merchant: MerchantAutocompleteModel | BillersAutocompleteModel
  ) {
    this.selectedMerchant = merchant;
    this.getMerchantDetails(merchant.id);
  }
  getSelectedProduct(product: ProductAutocompleteModel) {
    this.selectedProduct = product;
    if (this.type === 'product' && !this.productDetails) {
      this.selectedPaymentMenu = 'Product-Payment';
    }
    if (!this.productDetails) {
      this.getProductDetails(product.id);
    }
  }

  selectPaymentMenu(type: 'Direct-Payment' | 'Product-Payment' | '') {
    this.selectedPaymentMenu = type;
    if (type === 'Direct-Payment') {
      this.steps = 'second';
    }
  }
  selectProductLookupChoice(choice: ProductLookupChoiceModel) {
    this.selectedProductLookupChoice = choice;
  }

  // NOTE :: METHODS FOR RESET EACH DATA

  manageBack() {
    if (this.steps === 'second') {
      this.resetDebitOptions();
      this.steps = 'first';
      if (
        this.productDetails?.lookup_metadata.length === 0 &&
        this.productDetails.metadata.length === 0 &&
        this.productDetails.price
      ) {
        this.resetProduct();
      }
      if (this.selectedPaymentMenu === 'Direct-Payment') {
        this.selectedPaymentMenu = '';
      }
      return;
    }
    if (this.steps === 'first') {
      if (this.selectedProduct) {
        this.resetProduct();
        return;
      }
      if (this.selectedMerchant && this.category) {
        this.resetMerchant();
        return;
      }
      if ((this.category && !this.selectedMerchant) || !this.category) {
        this.closeMerchantPaymentDialog();
      }
    }
  }

  resetAllData() {
    this.selectedPaymentMenu = '';
    this.merchant = null;
    this.product = null;
    this.category = null;
    this.resetMerchant();
    this.steps = 'first';
  }

  resetLookupData() {
    this.productLookup = null;
    this.resetSelectedLookupChoice();
    this.lookupMetadataForm.reset();
    this.metadataForm.reset();
  }
  resetSelectedLookupChoice() {
    this.selectedProductLookupChoice = null;
  }
  resetProduct() {
    this.selectedProduct = null;
    this.productWaitList = [];
    this.productDetails = null;
    if (this.merchantDetails?.accepts_simple_payment) {
      this.selectedPaymentMenu = '';
    } else {
      this.selectedPaymentMenu = 'Product-Payment';
    }
    this.resetLookupData();
  }
  resetMerchant() {
    this.resetDebitOptions();
    this.resetProduct();
    this.selectedMerchant = null;
    this.merchantDetails = null;
  }
  resetDebitOptions() {
    this.debitAccount = null;
    this.debitWallet = null;
    this.simplePaymentForm.reset();
    this.activeTipControl.reset();
    this.tipLevelControl.reset();
    this.selectedTipWaiterId = null;
    this.tipAmount = 0;
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
      lookup_subtitle: merchant.merchant_code,
      lookup_title: merchant.merchant_title,
      merchant_category_name: merchant.merchant_category.name,
    };
  }

  private manageMerchantBill(data: PayMerchantResponseModel) {
    const merchantBill: MerchantBillModel = {
      debit_account: '',
      name: '',
      merchantName: this.selectedMerchant?.lookup_title as string,
      date: data.response_data.date,
      printable_text: data.response_data.orders[0].printable_text ?? '',
      amount: data.response_data.amount,
      code: data.response_data.bill,
      product: {
        name: this.selectedProduct?.lookup_title ?? '',
        value: '',
      },
      description: '',
      adress: '',
      credit_account: '',
    };
    const landscapeBill: LandscpeBillModel = {
      logo_url: '',
      printable_text: data.response_data.orders[0].printable_text ?? '',
      receipt_date: data.response_data.date,
    };

    if (this.productDetails?.voucher_type === 'L') {
      this.dialogService.openLandscapeBillPopup(landscapeBill);
    } else {
      this.dialogService.openMerchantBillPopup(merchantBill);
    }
  }

  private manageSimplePaymentMerchantBill(
    data: MerchantSimplePaymentResponseModel
  ) {
    this.dialogService.openMerchantBillPopup({
      name: data.response_data.delivered_to,
      code: data.response_data.bill,
      adress: '',
      amount: data.response_data.amount,
      credit_account: this.merchantDetails?.merchant_main_account ?? '',
      date: data.response_data.date,
      debit_account: this.debitAccount?.acc_short_number ?? '',
      description: this.simplePaymentForm.value.description ?? '',
      merchantName: this.selectedMerchant?.lookup_title ?? '',
      printable_text: data.response_data.orders[0].printable_text ?? '',
      // product:{}
    });
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
