import { Component, OnInit } from '@angular/core';
import { DialogService, MerchantService } from '../../../core/services';
import {
  ProductAutocompleteModel,
  ProductModel,
} from '../../merchant/products/products.model';
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
  InvoiceGroupModel,
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
  searchGroup = new FormControl('');
  searchSupplier = new FormControl('');
  searchTeller = new FormControl('');
  products: ProductAutocompleteModel[] | null = null;
  product!: ProductAutocompleteModel;
  productDetails!: ProductModel | null;
  suppliers!: ProvidersModel[] | null;
  supplier!: ProvidersModel;
  invoices_groups!: InvoiceGroupModel[] | null;
  measures: MeasureModel[] = [];
  tellers: TellerAutoCompleteModel[] = [];
  merchant_teller_id!: number;
  merchant_teller_name = '';
  invoiceForm: FormGroup;
  createGroupForm: FormGroup;
  dialogState$!: Observable<DialogResponseModel>;
  isLoading = true;
  searchType: EmptyStateModel = 'product';
  isProductsSearch = false;
  disabledFavoriteAction = false;
  selectedProduct = false;
  selectedMerchant = false;
  action: 'merchant-payment' | 'output' = 'output';
  selectedModal:
    | 'add-to-group'
    | 'select-teller'
    | 'select-group'
    | 'select-teller-existant-group'
    | 'create-group' = 'add-to-group';

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialogState$ = this.dialogService.getDialogState();
    this.invoiceForm = new FormGroup({
      measure_value: new FormControl('', Validators.required),
      measure_type: new FormControl(Validators.required),
      pin: new FormControl('', Validators.required),
    });
    this.createGroupForm = new FormGroup({
      group_name: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    this.isLoading = false;
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
    this.merchantService
      .getPurchasedProducts(this.merchantId, search)
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

  searchProducts(search: string | null) {
    this.products = null;
    this.isLoading = true;
    this.isProductsSearch = true;

    if (search) {
      this.merchantService
        .getPurchasedProducts(this.merchantId, search)
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
      this.getPurchasedProducts();
    }
  }
  getSupplier() {
    this.suppliers = null;
    this.selectedProduct = true;
    this.isLoading = true;
    this.merchantService.getSupplier(this.product.id).subscribe({
      next: (data: { objects: ProvidersModel[] }) => {
        this.suppliers = data.objects;

        this.isLoading = false;
      },
    });
  }
  searchSuppliers(search: string | null) {
    this.suppliers = null;
    this.isLoading = true;
    if (search) {
      this.merchantService.searchSupplier(search).subscribe({
        next: data => {
          this.isLoading = false;
          this.suppliers = data.objects;
          console.log('the search result', data);
        },
      });
    } else {
      this.getSupplier();
    }
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
    };
    console.log('the body of  create bill', body);
    this.merchantService.createBill(body).subscribe({
      next: (data: { object: InvoiceResponseModel }) => {
        this.dialogService.closeLoading();
        if (data.object.success === false) {
          this.isLoading = false;
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
          this.isLoading = false;
          this.cancel();
        }
      },

      error: err => {
        this.isLoading = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message: err.error.message.toString() || 'failed to add a new bill',
        });
      },
    });
  }
  createBillByGroup(group_id: number) {
    this.isLoading = true;
    const body = {
      provider: this.supplier.id,
      merchant: Number(this.merchantId),
      payment_data: {
        quantity: this.invoiceForm.value.measure_value,
      },
      measure: this.invoiceForm.value.measure_type,
      pin_code: this.invoiceForm.value.pin,
    };
    console.log('the body of  create bill', body);
    this.merchantService.createBillByGroup(body, group_id).subscribe({
      next: (data: { object: InvoiceResponseModel }) => {
        this.dialogService.closeLoading();
        if (data.object.success === false) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              data.object.response_message ??
              'Failed to create an Invoice in a group',
          });
          this.isLoading = false;
        } else {
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message:
              data.object.response_message ?? 'Created an Invoice in a group',
          });
          this.invoiceForm.reset();
          this.cancel();
        }
      },

      error: err => {
        this.isLoading = false;
        console.log('the error of creating a bill', err);
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message:
            err.error.message.toString() || 'failed to add a bill in a group',
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

  createGroup(Merchant_teller_id: number) {
    this.isLoading = true;
    const body = {
      name: this.createGroupForm.value.group_name,
      merchant_teller: Merchant_teller_id,
    };
    console.log('the body', body);
    this.merchantService.createGroup(body).subscribe({
      next: data => {
        console.log('the group is created and the answer is :', data);
        this.dialogService.closeLoading();
        if (data.object.success === false) {
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: data.object.response_message ?? 'Failed to create a Group',
          });
          this.isLoading = false;
        } else {
          this.dialogService.openToast({
            title: '',
            type: 'success',
            message: data.object.response_message ?? 'Group created',
          });
          this.isLoading = false;
          this.searchTeller.patchValue('');
          this.selectedModal = 'select-teller-existant-group';
        }
      },
    });
  }

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
  searchTellers(search: string | null) {
    this.isLoading = true;
    if (search) {
      const data = {
        search: search,
        merchant: this.merchantId,
      };
      this.merchantService.searchTellersByMerchant(data).subscribe(tellers => {
        this.isLoading = false;
        this.tellers = tellers.objects;
      });
    } else {
      this.getTellersByMerchant();
    }
  }
  getProductDetails(Product_id: number) {
    this.productDetails = null;
    this.merchantService.getProductDetails(Product_id).subscribe({
      next: data => {
        this.productDetails = data.object;
      },
    });
  }

  selectProduct(product: ProductAutocompleteModel) {
    this.product = product;
    this.getSupplier();
    this.getProductMeasure(product.id);
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
    console.log('the seletedButton1 exitstant:', selectedButton);
    if (selectedButton === 'existant-group') {
      this.searchTeller.patchValue('');
      this.searchTellers(this.searchTeller.value);
      this.selectedModal = 'select-teller-existant-group';
      console.log(
        'the selected Button value when the existant-group condition select-teller:',
        selectedButton
      );
    } else if (selectedButton === 'new-group') {
      this.searchTeller.patchValue('');
      this.searchTellers(this.searchTeller.value);
      this.selectedModal = 'select-teller';
    }

    // else if (this.selectedModal === 'select-teller') {
    //   console.log('the seletedButton1:', selectedButton);
    //   if (selectedButton === 'existant-group') {
    //     console.log(
    //       'the selected Button value after the existant-group condition:',
    //       selectedButton
    //     );
    //     this.merchant_teller_id = Number(selectedButton);
    //     console.log('the id of the teller:', this.merchant_teller_id);

    //     this.getBillsGroupsByTeller(this.merchant_teller_id);
    //     this.selectedModal = 'select-group';
    //     console.log('the seletedButton:', selectedButton);
    //   }
    //   // if(selectedButton === 'new-group'){
    //   // }else
    // }
    // if (selectedButton === 'existant-group') {
    //     console.log('the selected Button value after the existant-group condition:', selectedButton);
    //     this.getBillsGroupsByTeller(Number(selectedButton));
    //   }
  }

  getSelectedTeller(teller_id: string, teller_name: string) {
    this.invoices_groups = null;
    if (this.selectedModal === 'select-teller-existant-group') {
      this.merchant_teller_id = Number(teller_id);
      this.merchant_teller_name = teller_name;
      this.getBillsGroupsByTeller(this.merchant_teller_id);
    } else if (this.selectedModal === 'select-teller') {
      this.merchant_teller_id = Number(teller_id);
      this.merchant_teller_name = teller_name;
      this.selectedModal = 'create-group';
    }
  }
  getBillsGroupsByTeller(merchant_teller_id: number) {
    if (this.selectedModal === 'select-teller-existant-group') {
      this.selectedModal = 'select-group';
    }
    this.searchGroup.patchValue('');
    this.merchantService.getBillsGroupsByTeller(merchant_teller_id).subscribe({
      next: (data: { objects: InvoiceGroupModel[] }) => {
        this.invoices_groups = data.objects;
        console.log('the response of getBillsGroupsByTeller:', data);
      },
    });
  }
  searchBillsGroups(search: string | null) {
    this.isLoading = true;
    if (search) {
      this.merchantService
        .getBillsGroupsByTeller(Number(this.merchantId), search)
        .subscribe(groups => {
          this.isLoading = false;
          this.invoices_groups = groups.objects;
        });
    } else {
      this.getTellersByMerchant();
    }
  }
  goBackWithModal() {
    if (
      this.selectedModal === 'select-teller' ||
      this.selectedModal === 'select-teller-existant-group'
    ) {
      this.selectedModal = 'add-to-group';
    } else if (this.selectedModal === 'select-group') {
      this.searchTeller.patchValue('');
      this.searchTellers(this.searchTeller.value);
      this.selectedModal = 'select-teller-existant-group';
    } else if (this.selectedModal === 'create-group') {
      this.searchTeller.patchValue('');
      this.searchTellers(this.searchTeller.value);
      this.selectedModal = 'select-teller';
    }
  }
  getProductMeasure(product_id: number) {
    this.merchantService.getProductMeasure(product_id).subscribe({
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
      this.products = null;
      this.getPurchasedProducts();
      this.router.navigate(['/m/mymarket/purchase']);
    } else if (this.selectedMerchant === true) {
      this.searchSupplier.patchValue('');
      this.selectedMerchant = false;
      this.router.navigate(['/m/mymarket/purchase'], { fragment: 'providers' });
    }
  }
  cancel() {
    this.isLoading = false;
    this.invoiceForm.reset();
    if (this.selectedMerchant === true) {
      this.selectedMerchant = false;
      this.selectedProduct = false;
      this.router.navigate(['/m/mymarket/purchase']);
    }
  }
}
