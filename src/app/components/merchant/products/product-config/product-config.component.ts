import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { DialogService, MerchantService } from '../../../../core/services';
import { VariableService } from '../../../../core/services/variable/variable.service';

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
  // category: any;
  private onDestroy$: Subject<void> = new Subject<void>();

  // selectedFile: any;
  // previewUrl: any;
  // theme = '';
  // theme$: Observable<string>;
  // crumbs: any;
  acceptsSimplePayment = false;
  dialog$!: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  // tellers: any;
  selectedTeller: undefined;
  // tellerId: any;
  isActionDone = false;
  products!: productConfigModel[] | undefined;
  // filteredProducts: any;
  selectedProduct!: productConfigModel;
  product!: productConfigModel | undefined;
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
  // metadata: metadataModel | null = null;
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
    private dialogService: DialogService
    // private menuService: MenuService
  ) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
    // this.dialog$ = this.store.select(DialogState.GetDialog);
    this.dialog$ = this.dialogService.getDialogState();

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
      next: (dialog: DialogResponseModel) => {
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.pin &&
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

    // this.isHover = new Array(this.metadata?.objects?.length).fill(false);
    // this.getTellers();
  }

  getConnectedMerchantInfo() {
    console.log(
      '=====================================Getting connected merchant info...'
    );
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      console.log(
        '===================================Received merchant info:',
        merchantInfo
      );
      this.merchant = merchantInfo.object.response_data;
      console.log(
        '=========================********Merchant info:',
        this.merchant
      );
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
    console.log('===================********getProducts method called');
    this.search.patchValue('');
    this.isProductsSearch = false;
    this.products = undefined;
    this.merchantService
      .getProductsByMerchant(this.merchant.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          console.log(
            '=================Response received from getProductsByMerchant'
          );
          const products = result as ProductConfigObjectsModel;
          this.products = products.objects;
          console.log('products:', this.products);
        },
        error: error => {
          console.log('Error occurred in getProductsByMerchant', error);
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

  selectProduct(product: productConfigModel) {
    this.selectedProduct = product;
    console.log(
      '==========================>>selectedProduct:',
      this.selectedProduct
    );

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
        console.log('==================>>> product:', product);

        this.product = product.object;
        console.log('====>> the product variable:', this.product);

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
    // this.store.dispatch(new OpenDialog(response));
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
