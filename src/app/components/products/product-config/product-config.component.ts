import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, Observable, takeUntil } from 'rxjs';
import { MerchantService } from '../../../core/services';
import { MarketService } from '../../../core/services/market/market.service';
import { VariableService } from '../../../core/services/variable/variable.service';
import { PaginationConfig } from '../../../global/global.model';
import { dialogModel } from '../../merchant/merchant.models';
import {
  MerchantModel,
  metadataModel,
  productConfigModel,
  productConfigObjectModel,
  selectedProductModel,
  updateProductInfoObjectModel,
} from '../products.model';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-product-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './product-config.component.html',
  styleUrl: './product-config.component.scss',
})
export class ProductConfigComponent implements OnInit {
  merchant!: MerchantModel;
  clientId!: number;
  // category: any;
  private onDestroy$: Subject<void> = new Subject<void>();

  // selectedFile: any;
  // previewUrl: any;
  // theme = '';
  // theme$: Observable<string>;
  // crumbs: any;
  acceptsSimplePayment = false;
  dialog$!: Observable<dialogModel>;
  dialog!: dialogModel;
  // tellers: any;
  selectedTeller: undefined;
  // tellerId: any;
  isActionDone = false;
  products!: productConfigObjectModel[] | undefined;
  // filteredProducts: any;
  selectedProduct!: selectedProductModel;
  product!: productConfigModel;
  action: string[] = [];
  search = new FormControl('');
  isProductsSearch = false;
  productConfigForm: FormGroup;
  selectedMenu = '';
  // merchantInfo: any;
  isLoading = false;
  toggleMetadata = false;
  searchMetadata = new FormControl('');
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  pages!: number;
  count!: number;
  metadata: metadataModel | null = null;
  loadingData = false;
  isHover: boolean[] = [];
  values: { field: string }[] = [];
  selectedFields: { name: string; id: number }[] = [];
  toggleMetadataForm = false;
  constructor(
    private merchantService: MerchantService,
    // private store: Store,
    private fb: FormBuilder,
    private variableService: VariableService,
    private marketService: MarketService
    // private menuService: MenuService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
    // this.dialog$ = this.store.select(DialogState.GetDialog);

    this.productConfigForm = new FormGroup({
      name: new FormControl(''),
      price: new FormControl(''),
      max_payment: new FormControl(''),
      min_payment: new FormControl(''),
      position: new FormControl(''),
      stockable: new FormControl(false),
      cart: new FormControl(false),
      incognito: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialog: { action: string; response: string }) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response === 'pin submitted' &&
              this.dialog.action === 'update_product_info'
            ) {
              this.updateProductInfo();
            }
          }
        }
      },
    });

    this.getConnectedMerchantInfo();

    // this.theme$.subscribe((theme: string) => {
    //     this.theme = theme;
    // });
    this.pagination.filters.limit = 15;
    // this.getMetadata();

    this.isHover = new Array(this.metadata?.objects?.length).fill(false);
    // this.getTellers();
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      this.merchant = merchantInfo.object.response_data;
      this.marketService.getConnectedMerchantId(this.merchant.id.toString());

      this.getProducts();
    });
  }
  // getMetadata() {
  //     this.loadingData = true;
  //     this.metadata = null;
  //     const searchValue = this.searchMetadata.value ?? '';
  //     if (searchValue !== '') {
  //         if (this.pagination?.filters.offset ?? 0 >= 1) {
  //             this.pagination.filters.offset = 0;
  //             this.currentPage = 0;
  //         }
  //     }
  //     this.menuService
  //         .getMetadata(searchValue, this.pagination)
  //         .pipe(takeUntil(this.onDestroy$))
  //         .subscribe({
  //             next: (data) => {
  //                 this.metadata = data;
  //                 this.count = data.count;
  //                 this.loadingData = false;
  //             },
  //             error: (err) => {
  //                 this.loadingData = false;
  //             },
  //         });
  // }

  isFieldSelected(name: string): boolean {
    return this.selectedFields.some(field => field.name === name);
  }

  toggleFieldSelection(id: number, name: string) {
    const fieldIndex = this.selectedFields.findIndex(
      field => field.name === name
    );
    if (fieldIndex !== -1) {
      this.selectedFields.splice(fieldIndex, 1);
    } else {
      this.selectedFields.push({ id: id, name: name });
    }
  }

  addNewField() {
    this.toggleMetadataForm = !this.toggleMetadataForm;
  }
  seeUpdates(updates: string) {
    if (updates === 'success') {
      this.toggleMetadata = true;

      this.metadata = null;
      // this.getMetadata();
    } else if (updates === 'list') {
      this.toggleMetadataForm = false;
      this.toggleMetadata = true;
    }
  }
  getProducts() {
    this.search.patchValue('');
    this.isProductsSearch = false;
    this.products = undefined;
    this.merchantService
      .getProductsByMerchant(this.merchant.id.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const products = result as productConfigObjectModel[];
          this.products = products;
        },
        error: error => {
          this.isLoading = false;
          console.log(error);

          const data = {
            title: 'failure',
            type: 'failed',
            message: 'Failed ',
          };
          // this.store.dispatch(new OpenDialog(data));
          console.log(data);
        },
      });
  }

  selectProduct(product: productConfigObjectModel) {
    this.selectedProduct = product.objects.selectedProduct;
    this.selectedMenu = 'details';
    this.getProductDetails();
  }
  toggleMetadataList() {
    this.toggleMetadata = !this.toggleMetadata;
  }
  toggleProductSwitchBox(box: string, action: string): void {
    this.productConfigForm.markAsDirty();

    if (box === 'cart') {
      if (action === 'accepts_cart' && !this.action.includes('accepts_cart')) {
        this.productConfigForm.patchValue({
          cart: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_accepts_cart'
        );
        this.action.push(action);
      } else if (action === 'not_accepts_cart') {
        this.productConfigForm.patchValue({
          cart: false,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'accepts_cart'
        );
        this.action.push(action);
      }
    } else if (box === 'stockable') {
      if (action === 'stockable' && !this.action.includes('stockable')) {
        this.productConfigForm.patchValue({
          stockable: true,
        });
        this.action = this.action.filter(
          (act: string) => act !== 'not_stockable'
        );
        this.action.push('is_stockable');
      } else if (action === 'not_stockable') {
        this.productConfigForm.patchValue({
          stockable: false,
        });
        this.action = this.action.filter((act: string) => act !== 'stockable');
        this.action.push(action);
      }
    } else if (box === 'incognito') {
      if (action === 'incognito' && !this.action.includes('incognito')) {
        this.productConfigForm.patchValue({
          incognito: true,
        });
        this.action = this.action.filter(
          (act: string) => act !== 'not_incognito'
        );
        this.action.push(action);
      } else if (action === 'not_incognito') {
        this.productConfigForm.patchValue({
          incognito: false,
        });
        this.action = this.action.filter((act: string) => act !== 'incognito');
        this.action.push(action);
      }
    }
  }

  getProductDetails() {
    // this.product = undefined;
    this.merchantService
      .getMerchantsProductsDetails(this.selectedProduct.id.toString())
      .subscribe(response => {
        const product = response as productConfigObjectModel;
        this.product = product.object;

        this.productConfigForm.patchValue({
          name: this.product.name,
          price: this.product.price,
          min_payment: this.product.minimun_payment_amount,
          max_payment: this.product.maximum_payment_amount,
          position: this.product.voucher_type,
          cart: this.product.accepts_cart,
          stockable: this.product.is_stockable,
          incognito: this.product.incognito_mode,
        });
      });
  }

  editProductInfo() {
    this.selectedMenu = 'configuration';

    this.productConfigForm.patchValue({
      name: this.product.name,
      price: this.product.price,
      min_payment: this.product.mininun_payment_amount,
      max_payment: this.product.maximum_payment_amount,
      position: this.product.voucher_type,
      cart: this.product.accepts_cart,
      stockable: this.product.is_stockable,
      incognito: this.product.incognito_mode,
    });
  }

  verifyPinProductUpdate() {
    const response = {
      title: '',
      type: 'pin',
      message: 'Enter your pin',
      action: 'update_product_info',
    };
    // this.store.dispatch(new OpenDialog(response));
    console.log(response);
  }

  updateProductInfo() {
    this.isLoading = true;
    const selectedFieldNames = this.getSelectedFieldNames();
    const body = {
      product: this?.selectedProduct?.id,
      merchant: this.merchant.id,
      action: this.action,
      price: this.productConfigForm.value.price,
      name: this.productConfigForm.value.name,
      minimun_payment_amount: this.productConfigForm.value.min_payment,
      maximum_payment_amount: this.productConfigForm.value.max_payment,
      voucher_type: this.productConfigForm.value.position,
      metadata: selectedFieldNames,
      pin_code: this.variableService.pin,
    };

    this.merchantService.updateProductInfo(body).subscribe({
      next: result => {
        const response = result as updateProductInfoObjectModel;
        this.isLoading = false;

        if (!response.object.success) {
          const failure = {
            title: '',
            type: 'failed',
            message:
              response?.object.response_message ?? 'Failed, please try again',
          };
          // this.store.dispatch(new OpenDialog(failure));
          console.log(failure);
        } else {
          this.getProductDetails();
          this.getProducts();
          this.selectedMenu = 'details';
          const data = {
            title: '',
            type: 'success',
            message:
              response?.object.response_message ?? 'Updated successfully',
          };
          // this.store.dispatch(new OpenDialog(data));
          console.log(data);
        }
      },
      error: error => {
        this.isLoading = false;

        const data = {
          title: 'failure',
          type: 'failed',
          message:
            error?.object.response_message ?? 'Failed to update product info ',
        };
        // this.store.dispatch(new OpenDialog(data));
        console.log(data);
      },
    });
  }
  getSelectedFieldNames(): number[] {
    return this.selectedFields.map(field => field.id);
  }
  searchProducts(search: string | null) {
    this.isProductsSearch = true;
    const data = {
      search: search,
      merchant: this.merchant.id,
    };
    this.products = undefined;
    if (search) {
      this.merchantService.searchProductByMerchant(data).subscribe(result => {
        const products = result as productConfigObjectModel[];
        this.isLoading = false;
        this.products = products;
      });
    } else {
      this.getProducts();
    }
  }
  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    // condition just for typescript
    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      // this.getMetadata();
    }
  }
  goBack() {
    if (this.selectedMenu === 'details') {
      this.selectedMenu = '';
    }
    if (this.selectedMenu === 'configuration') {
      this.selectedMenu = 'details';
    }
  }
}
