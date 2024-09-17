import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Subject, Observable, takeUntil } from 'rxjs';

import {
  ProductAutocompleteModel,
  ProductModel,
  UpdateProdcutInfoModel,
} from '../products.model';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import {
  ConfigService,
  DialogService,
  MenuService,
  MerchantService,
} from '../../../../core/services';
import { PlateformModel } from '../../../../core/services/config/main-config.models';
import { ProductCardComponent } from '../../global/product-card/product-card.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { MerchantModel } from '../../merchant.models';
import { MetadataFormComponent } from '../../../metadatas/metadata-form/metadata-form.component';
import { MetadataModel } from '../../../metadatas/metadata.model';

@Component({
  selector: 'app-product-config',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SkeletonComponent,
    ProductCardComponent,
    EmptyStateComponent,
    MetadataFormComponent,
  ],
  templateUrl: './product-config.component.html',
  styleUrl: './product-config.component.scss',
})
export class ProductConfigComponent implements OnInit, OnDestroy {
  @Output() get_selectedProduct = new EventEmitter<ProductAutocompleteModel>();
  merchant!: MerchantModel;
  private onDestroy$: Subject<void> = new Subject<void>();

  dialog$!: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  selectedTeller: undefined;
  products: ProductAutocompleteModel[] = [];
  selectedProduct!: ProductAutocompleteModel;
  product: ProductModel | null = null;
  action: string[] = [];
  search = new FormControl('');
  productConfigForm: FormGroup;
  selectedMenu = '';
  isLoading = true;
  toggleMetadata = false;
  searchMetadata = new FormControl('');
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  pages!: number;
  count!: number;
  loadingData = false;
  isHover: boolean[] = [];
  values: { field: string }[] = [];
  selectedFields: { name: string; id: number }[] = [];
  toggleMetadataForm = false;
  metadata: { objects: MetadataModel[] } | null = null;
  pin = '';

  searchType: EmptyStateModel = 'product';
  searchTypeOther: EmptyStateModel = 'other';
  disabledFavoriteAction = true;
  loading_productDetails = false;

  plateform$!: Observable<PlateformModel>;
  baseRouterLink = '/m/mymarket';
  isProductsSearch = false;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.plateform$ = this.configService.getPlateform();

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

  ngOnInit() {
    this.dialog$.subscribe({
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.pin &&
              this.dialog.action === 'update_product_info'
            ) {
              this.pin = this.dialog.response.pin;
              this.updateProductInfo();
            }
          }
        }
      },
    });

    this.plateform$.subscribe({
      next: plateform => {
        if (plateform === 'workstation') {
          this.baseRouterLink = '/w/workstation/m/market';
        } else if (plateform === 'myMarket') {
          this.baseRouterLink = '/m/mymarket';
        }
      },
    });

    this.getConnectedMerchantInfo();
    this.pagination.filters.limit = 15;
    this.getMetadata();

    this.isHover = new Array(this.metadata?.objects?.length).fill(false);
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      this.merchant = merchantInfo.object.response_data;

      this.merchantService.getConnectedMerchantId(this.merchant.id);
      this.getMerchantProducts();
    });
  }
  getMetadata() {
    this.loadingData = true;
    this.metadata = null;
    const searchValue = this.searchMetadata.value ?? '';
    if (searchValue !== '') {
      if (this.pagination?.filters.offset ?? 0 >= 1) {
        this.pagination.filters.offset = 0;
        this.currentPage = 0;
      }
    }
    this.menuService
      .getMetadata(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const data = response as { objects: MetadataModel[]; count: number };
          this.metadata = data;
          this.count = data.count;
          this.loadingData = false;
        },
        error: () => {
          this.loadingData = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: 'failed to get a metadata',
          });
        },
      });
  }

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
      this.getMetadata();
    } else if (updates === 'list') {
      this.toggleMetadataForm = false;
      this.toggleMetadata = true;
    }
  }
  getMerchantProducts(search?: string) {
    this.isLoading = true;
    this.search.patchValue('');
    this.products = [];
    this.merchantService
      .getMerchantProducts(this.merchant.id, search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
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

  selectProduct(product: ProductAutocompleteModel) {
    this.get_selectedProduct.emit(product);
    this.selectedProduct = product;

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
    this.loading_productDetails = false;
    this.merchantService
      .getProductDetails(this.selectedProduct.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.product = response.object;

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
          this.loading_productDetails = true;
        },
        error: () => {
          this.loading_productDetails = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: 'failed to get a product details',
          });
        },
      });
  }

  editProductInfo() {
    this.selectedMenu = 'configuration';

    this.productConfigForm.patchValue({
      name: this.product?.name,
      price: this.product?.price,
      min_payment: this.product?.minimun_payment_amount,
      max_payment: this.product?.maximum_payment_amount,
      position: this.product?.voucher_type,
      cart: this.product?.accepts_cart,
      stockable: this.product?.is_stockable,
      incognito: this.product?.incognito_mode,
    });
  }

  verifyPinProductUpdate(actionValue: string) {
    this.dialogService.openDialog({
      title: 'Enter your pin',
      type: 'pin',
      message: 'Enter your pin',
      action: actionValue,
    });
  }

  updateProductInfo() {
    this.loading_productDetails = false;
    this.dialogService.dispatchLoading();
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
      cart: this.productConfigForm.value.accepts_cart,
      stockable: this.productConfigForm.value.is_stockable,
      incognito: this.productConfigForm.value.incognito_mode,
      metadata: selectedFieldNames,
      pin_code: this.pin,
    };

    this.merchantService.updateProductInfo(body).subscribe({
      next: result => {
        const response = result as {
          object: {
            success: boolean;
            response_message: string;
            response_code: string;
            response_data: UpdateProdcutInfoModel;
          };
        };
        this.isLoading = false;

        this.dialogService.closeLoading();
        if (!response.object.success) {
          this.dialogService.openToast({
            title: 'failed',
            type: 'failed',
            message: response.object.response_message,
          });
        } else {
          this.loading_productDetails = false;
          this.getProductDetails();
          this.getMerchantProducts();
          this.selectedMenu = 'details';
          this.dialogService.openToast({
            title: 'success',
            type: 'success',
            message: response.object.response_message,
          });
        }
      },
      error: err => {
        this.isLoading = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          title: '',
          type: 'failed',
          message:
            err?.error?.object.response_message ??
            'Failed to update product info ',
        });
      },
    });
  }
  getSelectedFieldNames(): number[] {
    return this.selectedFields.map(field => field.id);
  }

  searchProducts(search: string | null) {
    this.products = [];
    this.isLoading = true;
    this.isProductsSearch = true;

    if (search) {
      this.merchantService
        .getMerchantProducts(this.merchant.id, search)
        .subscribe({
          next: result => {
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
      this.getMerchantProducts();
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
      this.getMetadata();
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

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
