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
import { MeasureModel, ProvidersModel } from '../invoice/invoice.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

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
  invoiceForm: FormGroup;
  dialogState$!: Observable<DialogResponseModel>;
  measure_id!: number;
  isLoading = true;
  searchType: EmptyStateModel = 'product';
  isProductsSearch = false;
  disabledFavoriteAction = false;
  selectedProduct = false;
  selectedMerchant = false;
  action: 'merchant-payment' | 'output' = 'output';

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.invoiceForm = new FormGroup({
      measure_value: new FormControl('', Validators.required),
      measure_type: new FormControl(this.measures[0]),
      pin: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe({
        next: fragment => {
          if (this.selectedProduct) {
            fragment = 'providers';
            this.router.navigate(['/m/mymarket/purchase'], {
              fragment: fragment,
            });
          }
          // else (this.selectedMerchant){
          //   this.router.navigate(['/m/mymarket/purchase'], { fragment: ''});
          // }
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
  getMeasureId() {
    if (this.invoiceForm.value.measure_type === this.measures[0]) {
      this.measure_id = this.measures[0].id;
    } else if (this.invoiceForm.value.measure_type === this.measures[1]) {
      this.measure_id = this.measures[1].id;
    }
  }
  createBill() {
    this.isLoading = !this.isLoading;
    this.getMeasureId();
    const body = {
      provider: this.supplier.id,
      merchant: Number(this.merchantId),
      payment_data: {
        quantity: this.invoiceForm.value.measure_value,
      },
      measure: this.measure_id,
      pin_code: this.invoiceForm.value.pin,
      merchant_product_id: this.product.id,
    };
    console.log('the body of  create bill', body);
    this.merchantService.createBill(body).subscribe({
      next: data => {
        this.isLoading = false;
        console.log('the response of the post of the bill:', data);
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

  // pinModal() {
  //   this.dialogService.openDialog({
  //     title: '',
  //     type: 'pin',
  //     message: 'Enter your pin code please',
  //     action: 'create',
  //   })
  // }
  selectProduct(product: ProductAutocompleteModel) {
    this.product = product;
    this.getSupplier();
  }

  selectSupplier(supplier: ProvidersModel) {
    this.selectedMerchant = true;
    this.supplier = supplier;
    console.log('selected supplier:', this.supplier);
  }

  getProductMeasure() {
    this.merchantService.getProductMeasure(this.product.id).subscribe({
      next: (data: { objects: MeasureModel[] }) => {
        this.measures = data.objects;
        console.log('the measures :', this.measures);
      },
    });
  }
}
