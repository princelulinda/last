import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import {
  MerchantModel,
  ProductsModel,
  TopClientsByAmountModel,
  getMerchantsProductsDetailsModel,
  getPaymentStatsModel,
  merchantLocationModel,
  tellerModel,
  tellerObjectModel,
  topClientsByTransactionsModel,
} from '../../merchant.models';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { MenuService } from '../../../../core/services/menu/menu.service';
import { MetadataModel } from '../../../metadatas/metadata.model';

@Component({
  selector: 'app-merchant-details',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    AmountVisibilityComponent,
  ],
  templateUrl: './merchant-details.component.html',
  styleUrl: './merchant-details.component.scss',
})
export class MerchantDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  selectedMenu = '';
  selectedSubMenu = '';
  isLoading = false;
  merchantId = '';

  inputActive = false;
  updateLogo = false;
  merchantLocation!: merchantLocationModel;
  longitude = 29.3568512;
  latitude = -3.3816576;
  isSettingLocationDone = false;
  showAmounts = false;
  logoUrl = '';

  addNewForm = new FormGroup({
    inputTellerName: new FormControl(),
    inputTellerEmail: new FormControl(),
    inputTellerCode: new FormControl(),
    inputTellerType: new FormControl(),
    inputTellerState: new FormControl(),
  });

  productConfigForm: FormGroup;

  merchantForm = this.fb.group({
    inputTitle: ['', Validators.required],
    inputCategory: ['', Validators.required],
    inputIsActive: ['', Validators.required],
  });
  // inputTitle: FormControl = this.merchantForm.value.inputTitle;
  merchant!: MerchantModel;
  clientId!: string;
  category!: string;
  theme = '';

  crumbs = [
    {
      label: 'Merchants',
      link: '/w/workstation/desk/merchant/list',
    },
    {
      label: 'Details',
      active: true,
    },
  ];

  acceptsSimplePayment = false;
  tellers!: tellerObjectModel[];
  selectedTeller!: tellerObjectModel;

  tellerId!: string;
  isActionDone = false;
  products!: ProductsModel[];

  client!: tellerModel;
  selectedProduct!: getMerchantsProductsDetailsModel;
  product!: getMerchantsProductsDetailsModel;
  isChecked = false;
  isCheck = true;
  search = new FormControl('');
  isProductsSearch = false;
  merchantConfigForm: FormGroup;
  incognitoMerchant = false;
  merchantLogo!: string;
  previewImage!: string;
  action!: string[];
  isTellerLoading = false;
  topClientsByAmount!: TopClientsByAmountModel[];
  topClientsByTransactions!: topClientsByTransactionsModel[];
  selectedOption!: string;
  paymentStats!: getPaymentStatsModel[];
  tellerCreationDone = false;
  newTellerForm: FormGroup;

  toggleMetadata = false;
  searchMetadata = new FormControl('');
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  pages!: string;
  count!: number;

  metadata!: MetadataModel[];

  loadingData = false;
  isHover: boolean[] = [];
  values: { field: string }[] = [];
  selectedFields: { name: string; id: number }[] = [];
  toggleMetadataForm = false;

  constructor(
    private route: ActivatedRoute,
    private merchantService: MerchantService,
    private fb: FormBuilder,

    private menuService: MenuService
  ) {
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
    this.merchantConfigForm = new FormGroup({
      name: new FormControl(''),
      slug: new FormControl(''),
      plug: new FormControl(''),
      simplePayment: new FormControl(false),
      cart: new FormControl(false),
      incognitoMerchant: new FormControl(false),
      cashin: new FormControl(false),
      category: new FormControl(''),
    });
    this.newTellerForm = new FormGroup({
      isChecked: new FormControl(this.isChecked),
      client: new FormControl('', Validators.required),
      alias: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: data => {
        if (data) {
          this.merchantId = data['id'];
        }
        this.getMerchantsDetails();
        this.getTopClientsByAmount();
        this.getTopClientsByTransactions();
        this.getPaymentStats();
      },
    });
    this.merchantConfigForm.patchValue({
      name: this.merchant?.merchant_title,
      simplePayment: this?.merchant?.accepts_simple_payment,
      cart: this?.merchant?.accepts_cart,
      incognito: this?.merchant?.client_visibility_activated,
      slug: this?.merchant?.slug,
      plug: this?.merchant?.api_plug_name,
      cashin: this?.merchant?.has_cashin,
    });

    // this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (dialog: any) => {
    //         if (dialog) {
    //             this.dialog = dialog;
    //             if (this.dialog && this.dialog.response) {
    //                 if (
    //                     this.dialog.response === 'pin submitted' &&
    //                     this.dialog.action === 'toggle_simple_payment'
    //                 ) {
    //                     this.toggleAcceptsSimplePayment();
    //                 }
    //                 if (
    //                     this.dialog.response === 'pin submitted' &&
    //                     this.dialog.action === 'update_product_info'
    //                 ) {
    //                     this.updateProductInfo();
    //                 } else if (
    //                     this.dialog.action === 'update_merchant_info' &&
    //                     this.dialog.response === 'pin submitted'
    //                 ) {
    //                     this.updateMerchantDetails();
    //                 }
    //             }
    //         }
    //     },
    // });

    // this.theme$.subscribe((theme: string) => {
    //     this.theme = theme;
    // });

    // this.getCoords(event);
    this.pagination.filters.limit = 10;

    // this.getMetadata();
  }

  toggleMetadataList() {
    this.toggleMetadata = !this.toggleMetadata;
    if (this.toggleMetadata === false) {
      this.toggleMetadataForm = false;
    }
  }

  addNewField() {
    this.toggleMetadataForm = !this.toggleMetadataForm;
  }
  getSelectedFieldNames(): number[] {
    return this.selectedFields.map(field => field.id);
  }
  getMetadata() {
    this.loadingData = true;
    // this.metadata = null;
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
        next: data => {
          this.metadata = data.objects;
          this.count = data.count;
          this.loadingData = false;
        },
        error: () => {
          this.loadingData = false;
        },
      });
  }

  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      // this.getMetadata();
    }
  }

  // Select fields in metadata list

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

  createNewTeller() {
    this.isTellerLoading = true;
    let action;

    if (this.newTellerForm.value.isChecked) {
      action = true;
    } else {
      action = false;
    }

    const body = {
      client: this.client.id,
      merchant: this.merchant.id,
      can_receive_notifications: action,
      alias: this.newTellerForm.value.alias,
    };
    this.merchantService.createNewTeller(body).subscribe({
      next: (response: tellerModel) => {
        this.isTellerLoading = false;

        if (response.object.success === false) {
          // const data = {
          //     title: '',
          //     type: 'failed',
          //     message: response?.object?.response_message ?? 'Failed',
          // };
          // this.store.dispatch(new OpenDialog(data));
        } else {
          this.getTellersByMerchant();

          // const data = {
          //     title: '',
          //     type: 'success',
          //     message:
          //         response?.object?.response_message ??
          //         'New Teller created successfully',
          // };
          // this.store.dispatch(new OpenDialog(data));
          // this.closeModal.nativeElement.click();
        }
      },
      error: () => {
        this.isTellerLoading = false;

        // const data = {
        //     title: '',
        //     type: 'failed',
        //     message:
        //         err?.object?.response_message ??
        //         'Failed to create new teller, please try again',
        // };
        // this.store.dispatch(new OpenDialog(data));
      },
    });
  }

  toggleNotificationsCheckbox() {
    this.isChecked = !this.isChecked;

    this.newTellerForm.patchValue({
      isChecked: this.isChecked,
    });
  }

  toggleModal() {
    this.tellerCreationDone = false;

    setTimeout(() => {
      this.tellerCreationDone = true;
      this.newTellerForm.patchValue({
        client: '',
        isChecked: false,
        alias: '',
      });
      this.isChecked = false;
    }, 50);
  }
  getProducts() {
    this.search.patchValue('');
    this.isProductsSearch = false;
    // this.products = undefined;
    this.merchantService
      .getProductsByMerchant(this.merchant.id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: products => {
          this.products = products.objects;
        },
      });
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  refresh() {
    // this.merchant = undefined;
    this.getMerchantsDetails();
    this.inputActive = false;
  }
  updateMerchantDetails() {
    this.isLoading = true;

    const body = {
      merchant: this.merchant.id,
      merchant_title: this.merchantConfigForm.value.name,
      slug: this.merchantConfigForm.value.slug,
      action: this.action,
      // pin_code: this.variableService.pin,
      merchant_category: this.category,
      merchant_logo: this.merchantLogo,
      // category: this?.category?.id,
      api_plugin_name: this.merchantConfigForm.value.plug,
    };
    this.action = [];

    this.merchantService.updateMerchantDetails(body).subscribe({
      next: response => {
        this.isLoading = false;

        if (response.object.success === false) {
          // const data = {
          //     title: '',
          //     type: 'failed',
          //     message: response.object.response_message,
          // };
          // this.store.dispatch(new OpenDialog(data));
        } else {
          // const data = {
          //     title: '',
          //     type: 'success',
          //     message: 'Merchant details updated successfully',
          // };
          this.selectedSubMenu = 'details';
          // this.merchant = null;
          this.getMerchantsDetails();
          this.selectedMenu = '';
          // this.store.dispatch(new OpenDialog(data));
        }
      },
      error: () => {
        this.isLoading = false;

        // const data = {
        //     title: '',
        //     type: 'failed',
        //     message:
        //         'Failed to update merchant details, please try again',
        // };
        // this.store.dispatch(new OpenDialog(data));
      },
    });
  }
  getMerchantsDetails() {
    // this.merchant = undefined;
    this.merchantService
      .getMerchantsDetails(this.merchantId as unknown as number)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          if (data) {
            this.merchant = data.object;

            this.getTellersByMerchant();
            this.getMerchantProducts();

            this.merchantConfigForm.patchValue({
              name: this.merchant.merchant_title,
              simplePayment: this.merchant.accepts_simple_payment,
              slug: this.merchant.slug,
              cart: this.merchant.accepts_cart,
              plug: this.merchant.api_plug_name,
              incognito: this.merchant.client_visibility_activated,
              cashin: this.merchant.has_cashin,
            });
            if (this.merchant.merchant_location) {
              this.longitude = this.merchant.merchant_location.longitude;
              this.latitude = this.merchant.merchant_location.latitude;
            }

            if (this.merchant.merchant_logo) {
              this.logoUrl = this.merchant.merchant_logo;
            } else {
              this.logoUrl = '/src/assets/images/userprofile.png';
            }

            this.getProducts();

            this.merchantForm.patchValue({
              inputTitle: this.merchant.merchant_title,
              inputCategory: this.merchant.merchant_category.name,
              inputIsActive: this.merchant.is_active,
            });
          }
        },
      });

    // this.getCategory(this.category);
    if (this.clientId) {
      this.getClientId(this.clientId);
    }
    //
  }
  getClientId(event: string) {
    this.clientId = event;
  }
  // getCategory(event: updateMerchantDetailsModel) {
  //     if (event) {
  //         this.category = event.id;
  //     }
  // }
  cancelChanges() {
    this.inputActive = false;
    this.selectedSubMenu = '';
  }

  // addNewTeller() {
  //     this.isLoading = true;
  //     const body:any = {
  //         client: this.clientId.id,
  //         merchant: this.merchant.id,
  //         can_receive_notifications: false,
  //         alias: '',
  //         id:0
  //     };
  //     this.merchantService
  //         .createNewTeller(body)
  //         .pipe(takeUntil(this.onDestroy$))
  //         .subscribe({
  //             next: (data) => {
  //                 this.selectedMenu = 'tellers';
  //                 this.selectedSubMenu = ' ';

  //                 const datas = {
  //                     title: '',
  //                     type: 'success',
  //                     message: 'New teller createad successfull',
  //                 };
  //                 // this.store.dispatch(new OpenDialog(datas));
  //                 // this.getTellers();
  //                 this.isLoading = false;
  //                 // this.clientId = null;
  //             },
  //             error: () => {
  //                 this.isLoading = false;
  //                 const failure = {
  //                     title: 'failure',
  //                     type: 'failed',
  //                     message: 'Failed to create new teller ',
  //                 };
  //                 // this.store.dispatch(new OpenDialog(failure));
  //                 this.isLoading = false;
  //                 // this.clientId = undefined;
  //             },
  //         });
  // }

  cancelCreation() {
    this.selectedMenu = 'tellers';
    // this.clientId = null;
  }

  getCoords(event: merchantLocationModel) {
    this.merchantLocation = event;

    if (this.merchantLocation) {
      // this.updateMerchantLocation();
    }
  }

  // updateMerchantLocation() {
  //     const body = {
  //         merchant_location: {
  //             latitude: this.merchantLocation.lat,
  //             longitude: this.merchantLocation.lng,
  //         },
  //     };
  //     this.merchantService
  //         .UpdateMerchantDetails(this.merchantId, body)
  //         .subscribe({
  //             next: (response) => {
  //                 if (response.object.success) {
  //                     this.getMerchantsDetails();

  //                     this.isSettingLocationDone = true;
  //                 }
  //             },
  //         });
  // }

  showModal() {
    // const response = {
    //     title: '',
    //     type: 'pin',
    //     message: 'Enter your pin',
    //     action: 'toggle_simple_payment',
    // };
    // this.store.dispatch(new OpenDialog(response));
  }

  // toggleAcceptsSimplePayment() {
  //     this.isLoading = true;
  //     let action = '';

  //     if (this.acceptsSimplePayment === true) {
  //         action = 'not_accepts_simple_payment';
  //     } else if (this.acceptsSimplePayment === false) {
  //         action = 'accepts_simple_payment';
  //     }
  //     const body = {
  //         action: [action],
  //         merchant: this.merchantId,
  //         // pin_code: this.variableService.pin,
  //     };

  //     this.merchantService.updateMerchantDetails(body).subscribe({
  //         next: (response) => {
  //             this.isLoading = false;

  //             if (!response.object.success) {
  //                 // const failure = {
  //                 //     title: '',
  //                 //     type: 'failed',
  //                 //     message: response.object.response_message,
  //                 // };
  //                 // this.store.dispatch(new OpenDialog(failure));
  //             } else {
  //                 this.acceptsSimplePayment =
  //                     action === 'accepts_simple_payment';
  //                 this.merchant.accepts_simple_payment =
  //                     this.acceptsSimplePayment;
  //                 this.getMerchantsDetails();
  //                 // const data = {
  //                 //     title: '',
  //                 //     type: 'success',
  //                 //     message: response.object.response_message,
  //                 // };
  //                 // this.store.dispatch(new OpenDialog(data));
  //             }
  //         },
  //         error: () => {
  //             this.isLoading = false;

  //             // const data = {
  //             //     title: 'failure',
  //             //     type: 'failed',
  //             //     message: 'Failed to update merchant info ',
  //             // };
  //             // this.store.dispatch(new OpenDialog(data));
  //         },
  //     });
  // }

  selectMenu(menu: string) {
    this.selectedMenu = menu;

    if (menu === 'products') {
      this.getProducts();
    }
  }
  switchOption(name: string) {
    this.selectedOption = name;

    if (name === 'amount') {
      this.getTopClientsByAmount();
    }
    if (name === 'transaction') {
      this.getTopClientsByTransactions();
    }
  }

  getTellersByMerchant() {
    // this.tellers = undefined;
    this.isActionDone = false;
    this.merchantService
      .getTellersByMerchant(this.merchantId)
      .subscribe(tellers => {
        this.tellers = tellers.objects;
      });
  }

  displayTellerInfo(teller: { id: string }) {
    // this.selectedTeller = undefined;
    this.tellerId = teller.id;
    this.getTellerDetails();
  }

  getTellerDetails() {
    this.isActionDone = false;
    // this.selectedTeller = undefined;
    this.merchantService
      .getMerchantsTellersDetails(this.tellerId)
      .subscribe(data => {
        this.selectedTeller = data.object;
      });
  }

  getMerchantProducts() {
    // this.products = undefined;
    this.merchantService
      .getProductsByMerchant(this.merchantId)
      .subscribe(products => {
        this.products = products.objects;
      });
  }

  // Function for retrieving the top clients based on the amount spent.
  getTopClientsByAmount() {
    // this.topClientsByAmount = undefined;
    this.merchantService.getTopClientsByAmount(this.merchantId).subscribe({
      next: data => {
        this.topClientsByAmount = data.object.response_data;
        // Faites quelque chose d'autre avec les données...
      },
      error: (error: Error) => {
        // Gérez les erreurs éventuelles
        console.error(error);
      },
    });
  }

  /**
 * Function to refresh payment statistics based on the specified name.

 */
  refreshsPaymentStats(name: string) {
    if (name === 'paymentStats') {
      this.getPaymentStats();
    }

    if (name === 'amountOrTransaction') {
      this.getTopClientsByAmount();
      this.getTopClientsByTransactions();
    }
  }

  // Function for retrieving payment statistics and storing them in the 'paymentStats' property.
  getPaymentStats() {
    // this.paymentStats = undefined;
    this.merchantService.getPaymentStats(this.merchantId).subscribe({
      next: data => {
        this.paymentStats = data.object.response_data;
        // Faites quelque chose d'autre avec les données...
      },
      error: (error: Error) => {
        // Gérez les erreurs éventuelles
        console.error(error);
      },
    });
  }
  // Function for retrieving the top clients based on the Transactions spent.
  getTopClientsByTransactions() {
    // this.topClientsByTransactions = undefined;
    this.merchantService
      .getTopClientsByTransactions(this.merchantId)
      .subscribe({
        next: data => {
          this.topClientsByTransactions = data.object.response_data;
          // Faites quelque chose d'autre avec les données...
        },
        error: (error: Error) => {
          // Gérez les erreurs éventuelles
          console.error(error);
        },
      });
  }

  getTellerOptions(event: boolean) {
    this.isActionDone = event;

    if (this.isActionDone === true) {
      this.getTellersByMerchant();
    }

    if (this.tellers) {
      this.getTellerDetails();
    }
  }

  goBack() {
    if (
      this.selectedMenu === 'products' &&
      this.selectedSubMenu &&
      this.selectedSubMenu !== 'configuration'
    ) {
      this.selectedMenu = 'products';
      this.selectedSubMenu = '';
    } else if (
      this.selectedMenu === 'products' &&
      this.selectedSubMenu &&
      this.selectedSubMenu === 'configuration'
    ) {
      this.selectedMenu = 'products';
      this.selectedSubMenu = 'details';
    } else {
      this.selectedMenu = '';
    }
  }

  selectProduct(product: getMerchantsProductsDetailsModel) {
    this.selectedProduct = product;
    this.selectedSubMenu = 'details';
    this.getProductDetails();
  }

  //  For product

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
      } else if (
        action === 'not_accepts_cart' &&
        !this.action.includes('not_accepts_cart')
      ) {
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
      } else if (
        action === 'not_stockable' &&
        !this.action.includes('not_stockable')
      ) {
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
      } else if (
        action === 'not_incognito' &&
        !this.action.includes('not_incognito')
      ) {
        this.productConfigForm.patchValue({
          incognito: false,
        });
        this.action = this.action.filter((act: string) => act !== 'incognito');
        this.action.push(action);
      }
    }
  }

  // For merchant

  toggletSwitchBox(box: string, action: string): void {
    this.merchantConfigForm.markAsDirty();

    if (box === 'cart') {
      if (action === 'accepts_cart' && !this.action.includes('accepts_cart')) {
        this.merchantConfigForm.patchValue({
          cart: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_accepts_cart'
        );
        this.action.push(action);
      } else if (
        action === 'not_accepts_cart' &&
        !this.action.includes('not_accepts_cart')
      ) {
        this.merchantConfigForm.patchValue({
          cart: false,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'accepts_cart'
        );
        this.action.push(action);
      }
    } else if (box === 'simple_payment') {
      if (
        action === 'accepts_simple_payment' &&
        !this.action.includes('accepts_simple_payment')
      ) {
        this.merchantConfigForm.patchValue({
          simplePayment: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_accepts_simple_payment'
        );
        this.action.push(action);
      } else if (
        action === 'not_accepts_simple_payment' &&
        !this.action.includes('not_accepts_simple_payment')
      ) {
        this.merchantConfigForm.patchValue({
          simplePayment: false,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'accepts_simple_payment'
        );
        this.action.push(action);
      }
    } else if (box === 'incognito') {
      if (action === 'visible' && !this.action.includes('visible')) {
        this.merchantConfigForm.patchValue({
          incognitoMerchant: true,
        });

        this.action = this.action.filter((act: string) => act !== 'invisible');
        this.action.push(action);
      } else if (action === 'invisible' && !this.action.includes('invisible')) {
        this.merchantConfigForm.patchValue({
          incognitoMerchant: false,
        });

        this.action = this.action.filter((act: string) => act !== 'visible');
        this.action.push(action);
      }
    } else if (box === 'has_cashin') {
      if (action === 'has_cashin' && !this.action.includes('has_cashin')) {
        this.merchantConfigForm.patchValue({
          cashin: true,
        });

        this.action = this.action.filter(
          (act: string) => act !== 'not_has_cashin'
        );
        this.action.push(action);
      } else if (
        action === 'not_has_cashin' &&
        !this.action.includes('not_has_cashin')
      ) {
        this.merchantConfigForm.patchValue({
          cashin: false,
        });

        this.action = this.action.filter((act: string) => act !== 'has_cashin');
        this.action.push(action);
      }
    }
  }

  getProductDetails() {
    // this.product = undefined;
    this.merchantService
      .getMerchantsProductsDetails(this.selectedProduct.id)
      .subscribe(product => {
        this.product = product.object;

        this.productConfigForm.patchValue({
          name: this.product.name,
          price: this.product.price,
          min_payment: this.product.minimun_payment_amount,
          max_payment: this.product.minimun_payment_amount,
          position: this.product.voucher_type,
          cart: this.product.accepts_cart,
          incognito: this.product.incognito_mode,
          stockable: this.product.is_stockable,
        });
      });
  }

  editProductInfo() {
    this.selectedSubMenu = 'configuration';

    this.productConfigForm.patchValue({
      name: this.product.name,
      price: this.product.price,
      min_payment: this.product.minimun_payment_amount,
      max_payment: this.product.minimun_payment_amount,
      position: this.product.voucher_type,
      cart: this.product.accepts_cart,
      incognito: this.product.incognito_mode,
      stockable: this.product.is_stockable,
    });
  }

  // Verifying pin while updating product infos

  verifyPinProductUpdate() {
    // const response = {
    //     title: '',
    //     type: 'pin',
    //     message: 'Enter your pin',
    //     action: 'update_product_info',
    // };
    // this.store.dispatch(new OpenDialog(response));
  }

  // Verifying pin while updating merchant infos

  openModal() {
    // const data = {
    //     title: 'Enter your pin to update merchant information',
    //     type: 'pin',
    //     message: 'Enter your pin to update merchant information',
    //     action: 'update_merchant_info',
    // };
    // this.store.dispatch(new OpenDialog(data));
  }

  // updateProductInfo() {
  //     this.isLoading = true;
  //     const selectedFieldNames = this.getSelectedFieldNames();

  //     const body:any = {
  //         product: this.selectedProduct.id,
  //         merchant: this.merchantId,
  //         action: this.action,
  //         price: this.productConfigForm.value.price,
  //         name: this.productConfigForm.value.name,
  //         minimum_payment_amount: this.productConfigForm.value.min_payment,
  //         maximum_payment_amount: this.productConfigForm.value.max_payment,
  //         voucher_type: this.productConfigForm.value.position,
  //         metadata: selectedFieldNames,
  //         pin_code: this.variableService.pin,
  //     };

  //     this.merchantService.updateProductInfo(body).subscribe({
  //         next: (response: any) => {
  //             this.isLoading = false;

  //             if (!response.object.success) {
  //                 const failure = {
  //                     title: '',
  //                     type: 'failed',
  //                     message:
  //                         response?.object?.response_message ??
  //                         'Failed. please try again',
  //                 };
  //                 // this.store.dispatch(new OpenDialog(failure));
  //             } else {
  //                 this.getProductDetails();
  //                 this.getMerchantProducts();
  //                 this.selectedSubMenu = 'details';
  //                 const data = {
  //                     title: '',
  //                     type: 'success',
  //                     message:
  //                         response?.object?.response_message ??
  //                         'Updated successfully',
  //                 };
  //                 // this.store.dispatch(new OpenDialog(data));
  //             }
  //         },
  //         error: (error:Error) => {
  //             this.isLoading = false;

  //             // const data = {
  //             //     title: 'failure',
  //             //     type: 'failed',
  //             //     message:
  //             //         error?.object?.response_message ??
  //             //         'Failed to update product info ',
  //             // };
  //             // this.store.dispatch(new OpenDialog(data));
  //         },
  //     });
  // }

  seeUpdates(updates: string) {
    if (updates === 'success') {
      this.toggleMetadata = true;
      this.toggleMetadataForm = false;

      // this.metadata = null;
      // this.getMetadata();
    } else if (updates === 'list') {
      this.toggleMetadataForm = false;
      this.toggleMetadata = true;
    }
  }

  searchProducts(search: string | null) {
    this.isProductsSearch = true;

    const data = {
      search: search,
      merchant: this.merchantId,
    };
    // this.products = undefined;
    if (search) {
      this.isLoading = true;

      this.merchantService.searchProductByMerchant(data).subscribe(products => {
        this.isLoading = false;
        this.products = products.objects;
      });
    } else {
      this.getProducts();
    }
  }
}
