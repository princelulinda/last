import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, takeUntil, Subject } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  ApiService,
  AuthService,
  BankService,
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../core/services';
import { PlateformModel } from '../../../core/services/config/main-config.models';
import {
  ProductAutocompleteModel,
  TransactionModel,
} from '../../../components/merchant/products/products.model';
import { ProductCardComponent } from '../../../components/merchant/global/product-card/product-card.component';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { PaginationConfig } from '../../../global/models/pagination.models';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    ProductCardComponent,
    AmountVisibilityComponent,
  ],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Output() topProducts = new EventEmitter<{
    objects: ProductAutocompleteModel[];
    count: number;
  }>();
  @Output() product = new EventEmitter<ProductAutocompleteModel>();

  @Input() url = '';
  @Input() searchBar = false;

  plateform$!: Observable<PlateformModel>;
  plateform!: PlateformModel;
  products!: ProductAutocompleteModel[];
  response_data = 0;
  loader = false;
  productsNumber = 0;
  pagination: PaginationConfig = {
    filters: {
      limit: 3,
      offset: 0,
    },
  };

  recentTransactions!: TransactionModel[] | undefined | null;
  isTransactionDone = false;
  lastTransfers!: TransactionModel[] | undefined;
  isTransfer = false;
  isBalanceShown = false;
  isBalanceShown$!: Observable<boolean>;
  favoriteBeneficiaries!: TransactionModel[] | undefined;

  clientId$: Observable<number>;
  clientId!: string;
  selectedBankId$!: Observable<string>;
  clientVerified = '&filter_for_client=true';

  constructor(
    private configService: ConfigService,
    private merchantService: MerchantService,
    private apiService: ApiService,
    private authService: AuthService,
    private bankService: BankService,
    private dialogService: DialogService
  ) {
    this.plateform$ = this.configService.getPlateform();
    this.clientId$ = this.authService.getUserClientId();
    this.isBalanceShown$ = this.dialogService.getAmountState();
  }

  ngOnInit(): void {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
    this.getAllProducts();

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isShowed: boolean) => {
        this.isBalanceShown = isShowed;
      });
    this.getRecentTransactions();
  }

  getAllProducts() {
    if (!this.url) {
      this.merchantService
        .getTopProducts()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: data => {
            const response = data as {
              objects: ProductAutocompleteModel[];
              count: number;
            };
            this.response_data = response.count;
            (this.products as ProductAutocompleteModel[]) = response.objects;
            this.loader = true;
            // this.topProducts.emit(this.products);
          },
        });
    } else {
      this.apiService
        .get<{ objects: ProductAutocompleteModel[]; count: number }>(this.url)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: data => {
            (this.products as ProductAutocompleteModel[]) = data.objects;
            this.loader = true;
            this.productsNumber = data.count;
            if (this.productsNumber == 0) {
              console.log('Loading product');
            }
          },
        });
    }
  }

  selectProduct(event: ProductAutocompleteModel) {
    this.product.emit(event);
    console.log('PRoducts', this.product);
  }

  handleTransfer() {
    this.bankService.isTransfer$.subscribe(data => {
      this.isTransfer = data;

      this.getFavoriteBeneficiaries();
      this.getLastTransfers();
    });
  }

  getRecentTransactions() {
    this.bankService.updateTransaction(false);
    this.isTransactionDone = false;
    this.recentTransactions = undefined;

    const period = {
      start_date: '',
      end_date: '',
    };

    this.bankService
      .getRecentTransactions(this.pagination, '', period, this.clientVerified)
      .subscribe(transfers => {
        this.recentTransactions = transfers.objects;
        this.bankService.updateTransaction(false);
      });
  }

  getLastTransfers() {
    this.bankService.updateTransaction(false);
    this.isTransactionDone = false;
    this.lastTransfers = undefined;
    this.bankService.getTransfersList().subscribe(transfers => {
      this.lastTransfers = transfers.objects;
      this.bankService.updateTransaction(false);
    });
  }

  getFavoriteBeneficiaries() {
    this.bankService.updateTransaction(false);
    this.isTransactionDone = false;
    this.favoriteBeneficiaries = undefined;
    this.bankService.getLastBeneficiary().subscribe(beneficiaries => {
      this.favoriteBeneficiaries = beneficiaries.objects;
      this.bankService.updateTransaction(false);
    });
  }
}
