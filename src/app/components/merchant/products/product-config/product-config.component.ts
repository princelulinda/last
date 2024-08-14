import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable, takeUntil } from 'rxjs';

import {
  MerchantModel,
  productConfigModel,
  ProductConfigObjectsModel,
  updateProductInfoObjectModel,
} from '../products.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../../core/services';
import { PlateformModel } from '../../../../core/services/config/main-config.models';

@Component({
  selector: 'app-product-config',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './product-config.component.html',
  styleUrl: './product-config.component.scss',
})
export class ProductConfigComponent implements OnInit {
  merchant!: MerchantModel;
  clientId!: number;
  private onDestroy$: Subject<void> = new Subject<void>();

  acceptsSimplePayment = false;
  dialog$!: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  selectedTeller: undefined;
  isActionDone = false;
  products!: productConfigModel[] | undefined;
  selectedProduct!: productConfigModel;
  product!: productConfigModel | undefined;
  action: string[] = [];
  search = new FormControl('');
  isProductsSearch = false;
  productConfigForm: FormGroup;
  selectedMenu = '';
  isLoading = false;
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
  pin = '';

  plateform$!: Observable<PlateformModel>;
  baseRouterLink = '/m/mymarket';

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private configService: ConfigService
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

  ngOnInit(): void {
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
          this.baseRouterLink = '/w/workstation/market';
        } else if (plateform === 'myMarket') {
          this.baseRouterLink = '/m/mymarket';
        }
      },
    });

    this.getConnectedMerchantInfo();
    this.pagination.filters.limit = 15;
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      this.merchant = merchantInfo.object.response_data;

      this.merchantService.getConnectedMerchantId(this.merchant.id);
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

      // this.metadata = null;
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
      .getProductsByMerchant(this.merchant.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const products = result as ProductConfigObjectsModel;
          this.products = products.objects;
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

  selectProduct(product: productConfigModel) {
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
    // this.product = undefined;
    this.merchantService
      .getMerchantsProductsDetails(this.selectedProduct.id)
      .subscribe(response => {
        const product = response as { object: productConfigModel };

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
      name: this.product?.name,
      price: this.product?.price,
      min_payment: this.product?.mininun_payment_amount,
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
      pin_code: this.pin,
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
        const products = result as ProductConfigObjectsModel;
        this.isLoading = false;
        this.products = products.objects;
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
