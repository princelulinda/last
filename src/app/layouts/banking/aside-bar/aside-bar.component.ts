import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../core/services/merchant/model';
import {
  AllProductModel,
  ProductModel,
  TransactionModel,
  TransactionObjectModel,
} from '../../../components/products/products.model';
import { ProductCardComponent } from '../../../components/dev/product-card/product-card.component';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [SkeletonComponent, CommonModule, ProductCardComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Output() topProducts = new EventEmitter<AllProductModel[]>();
  @Output() product = new EventEmitter<ProductModel>();

  @Input() url = '';
  @Input() searchBar = false;

  plateform$!: Observable<PlateformModel>;
  plateform!: PlateformModel;
  products!: ProductModel[];
  response_data = 0;
  loader = false;
  productsNumber = 0;
  productPagination: Pagination = {
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
    this.getAllProducts('');

    this.isBalanceShown$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((isShowed: boolean) => {
        this.isBalanceShown = isShowed;
      });
    this.getRecentTransactions();
  }

  getAllProducts(search: string) {
    if (!this.url) {
      this.merchantService
        .searchProduct(this.productPagination, search)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: AllProductModel) => {
            this.response_data = data.count;
            (this.products as ProductModel[]) = data.objects;
            this.loader = true;
            // this.topProducts.emit(this.products);
          },
        });
    } else {
      this.apiService
        .get<AllProductModel>(this.url)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: AllProductModel) => {
            (this.products as ProductModel[]) = data.objects;
            this.loader = true;
            this.productsNumber = data.count;
            if (this.productsNumber == 0) {
              console.log('Loading product');
            }
          },
        });
    }
  }

  selectProduct(event: ProductModel) {
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
      .getRecentTransactions('', period, this.clientVerified)
      .subscribe((transfers: TransactionObjectModel) => {
        this.recentTransactions = transfers.objects;
        this.bankService.updateTransaction(false);
      });
  }

  getLastTransfers() {
    this.bankService.updateTransaction(false);
    this.isTransactionDone = false;
    this.lastTransfers = undefined;
    this.bankService
      .getTransfersList()
      .subscribe((transfers: TransactionObjectModel) => {
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
