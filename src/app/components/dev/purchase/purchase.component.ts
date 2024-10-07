import { Component, OnInit } from '@angular/core';
import { DialogService, MerchantService } from '../../../core/services';
import { ProductAutocompleteModel } from '../../merchant/products/products.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductCardComponent } from '../../merchant/global/product-card/product-card.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../global/components/empty-states/empty-state/empty-state.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  InvoiceResponseModel,
  MeasureModel,
  ProvidersModel,
} from '../invoice/invoice.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { TellerAutoCompleteModel } from '../../merchant/merchant.models';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductCardComponent,
    SkeletonComponent,
    EmptyStateComponent,
    RouterLink,
    SkeletonComponent,
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  merchantId!: string;
  search = new FormControl('');
  products: ProductAutocompleteModel[] = [];
  product!: ProductAutocompleteModel;
  suppliers!: ProvidersModel[];
  supplier!: ProvidersModel;
  measures: MeasureModel[] = [];
  tellers: TellerAutoCompleteModel[] = [];
  invoiceForm: FormGroup;
  dialogState$!: Observable<DialogResponseModel>;
  isLoading = true;
  searchType: EmptyStateModel = 'product';
  isProductsSearch = false;
  disabledFavoriteAction = false;
  selectedProduct = false;
  selectedMerchant = false;
  action: 'merchant-payment' | 'output' = 'output';
  selectedModal: 'add-to-group' | 'select-teller' | 'select-group' =
    'add-to-group';

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.invoiceForm = new FormGroup({
      measure_value: new FormControl('', Validators.required),
      measure_type: new FormControl(4, Validators.required),
      pin: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: () => {
          if (!this.selectedMerchant && !this.selectedProduct) {
            this.router.navigate(['/m/mymarket/purchase']);
          }
        },
      });
    }
    this.getConnectedMerchantInfo();

    // this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //   next: (dialogResponse: DialogResponseModel) => {
    //     if(dialogResponse.action === 'create' && dialogResponse.response.pin) {
    //       this.invoiceForm.value.pin = dialogResponse.response.pin;
    //       this.createBill();
    //     }
    //   }
    // })
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      this.merchantId = merchantInfo.object.response_data.id;

      this.merchantService.getConnectedMerchantId(this.merchantId);
      this.getPurchasedProducts();
      this.getTellersByMerchant();
    });
  }
  getPurchasedProducts(search?: string) {
    this.isLoading = true;
    this.search.patchValue('');
    this.products = [];
    this.merchantService
      .getPurchasedProducts(this.merchantId, search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const result = data as { objects: ProductAutocompleteModel[] };
          this.products = result.objects;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: $localize`Something went wrong please retry again !`,
          });
        },
      });
  }

  searchProducts(search: string | null) {
    this.products = [];
    this.isLoading = true;
    this.isProductsSearch = true;

    if (search) {
      this.merchantService
        .getPurchasedProducts(this.merchantId, search)
        .subscribe({
          next: data => {
            const result = data as { objects: ProductAutocompleteModel[] };
            this.products = [];
            this.products = result.objects;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message: 'failed to get products',
            });
          },
        });
    } else {
      this.getPurchasedProducts();
    }
  }
  getSupplier() {
    this.selectedProduct = true;
    this.isLoading = true;
    this.merchantService.getSupplier(this.product.id).subscribe({
      next: (data: { objects: ProvidersModel[] }) => {
        this.suppliers = data.objects;
        this.getProductMeasure();
        this.isLoading = false;
      },
    });
  }
  createBill() {
    this.isLoading = true;
    const body = {
      provider: this.supplier.id,
      merchant: Number(this.merchantId),
      payment_data: {
        quantity: this.invoiceForm.value.measure_value,
      },
      measure: this.invoiceForm.value.measure_type,
      pin_code: this.invoiceForm.value.pin,
      merchant_product_id: this.product.id,
    };
    console.log('the body of  create bill', body);
    this.merchantService.createBill(body).subscribe({
      next: (data: { object: InvoiceResponseModel }) => {
        this.dialogService.closeLoading();
        if (data.object.success === false) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              data.object.response_message ?? 'Failed to create an Invoice',
          });
          this.isLoading = false;
        } else {
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: data.object.response_message ?? 'Invoice created',
          });
          this.cancel();
        }
      },

      error: err => {
        this.dialogService.closeLoading();
        const errorMessage = err.error.object.response_message;
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: errorMessage || 'failed to update merchant details',
        });
      },
    });
  }
  // createBillGroup() {
  //   this.isLoading = true;
  //     this.getMeasureId();
  //     const body = {
  //       name: '',
  //       merchant_teller: id,
  //     };
  //     console.log('the body of  create bill group', body);
  //     this.merchantService.createBillGroup(body).subscribe({
  //       next: data => {
  //         this.dialogService.closeLoading();
  //         if (data.object.success === false) {
  //           this.dialogService.openToast({
  //             title: '',
  //             type: 'failed',
  //             message:
  //               data.object.response_message ?? 'Failed to create an Invoice',
  //           });
  //           this.isLoading = false;
  //         } else {

  //           this.dialogService.openToast({
  //             title: '',
  //             type: 'success',
  //             message: data.object.response_message ?? 'Invoice created',
  //           });
  //         this.cancel();
  //         }
  //       },

  //       error: err => {
  //         this.dialogService.closeLoading();
  //         const errorMessage = err.error.object.response_message;
  //         this.dialogService.openToast({
  //           type: 'failed',
  //           title: '',
  //           message: errorMessage || 'failed to update merchant details',
  //         });
  //       },
  //     });
  // }
  getTellersByMerchant() {
    this.merchantService
      .getTellersByMerchantAutoComplete(Number(this.merchantId))
      .subscribe({
        next: data => {
          this.tellers = data.objects;
          console.log('the tellers info:', this.tellers);
        },
      });
  }

  selectProduct(product: ProductAutocompleteModel) {
    this.product = product;
    this.getSupplier();
    this.router.navigate(['/m/mymarket/purchase'], { fragment: 'providers' });
  }

  selectSupplier(supplier: ProvidersModel) {
    this.selectedMerchant = true;
    this.supplier = supplier;
    this.router.navigate(['/m/mymarket/purchase'], {
      fragment: 'selectedProvider',
    });
    console.log('selected supplier:', this.supplier);
  }
  addToGroup(selectedButton: string) {
    if (this.selectedModal === 'add-to-group') {
      this.selectedModal = 'select-teller';
    } else if (this.selectedModal === 'select-teller') {
      this.selectedModal = 'select-group';
      // if(selectedButton === 'new-group'){
      // }else
      if (selectedButton === 'existant-group') {
        // this.addToGroupByTeller();
      }
    }
  }
  // addToGroupByTeller() {}
  goBackWithModal() {
    if (this.selectedModal === 'select-teller') {
      this.selectedModal = 'add-to-group';
    } else if (this.selectedModal === 'select-group') {
      this.selectedModal = 'select-teller';
    }
  }
  getProductMeasure() {
    this.merchantService.getProductMeasure(this.product.id).subscribe({
      next: (data: { objects: MeasureModel[] }) => {
        this.measures = data.objects;
        console.log('the measures :', this.measures);
      },
    });
  }

  goBack() {
    if (this.selectedProduct === false && this.selectedMerchant === false) {
      this.router.navigate(['/m/mymarket']);
    } else if (
      this.selectedProduct === true &&
      this.selectedMerchant === false
    ) {
      this.selectedProduct = false;
      this.router.navigate(['/m/mymarket/purchase']);
    } else if (this.selectedMerchant === true) {
      this.selectedMerchant = false;
      this.router.navigate(['/m/mymarket/purchase'], { fragment: 'providers' });
    }
  }
  cancel() {
    if (this.selectedMerchant === true) {
      this.selectedMerchant = false;
      this.selectedProduct = false;
      this.router.navigate(['/m/mymarket/purchase']);
    }
  }
}
