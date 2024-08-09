import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  // inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
// import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { Store } from '@ngxs/store';

// import { MerchantService } from 'src/app/core/services/merchant.service';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import {
  ApiService,
  AuthService,
  ConfigService,
} from '../../../../core/services';
// import { VariableService } from '../../../core/services/variable/variable.service';
import { Pagination } from '../../../../core/services/merchant/model';
// import {
//     ApiService,
//     VariableService,
//     GeneralService,
//     PaginationConfig,
// } from 'src/app/core';
// import { ActivatedRoute } from '@angular/router';
// import { ProductMerchantCardComponent } from '../product-merchant-card/product-merchant-card.component';
import { ProductCardComponent } from '../../../dev/product-card/product-card.component';
// import { AuthState, SwitchThemeState } from 'src/app/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { AllProductModel, ProductModel } from '../products.model';
import { MerchantModel } from '../products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    // NgxSkeletonLoaderModule,
    // ProductMerchantCardComponent,
    ProductCardComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent,
  ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss',
})
export class AllProductsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  // private variableService = inject(VariableService);

  // @Output() cartItem = new EventEmitter<any>();
  @Output() allProducts = new EventEmitter<AllProductModel[]>();
  @Output() product = new EventEmitter<ProductModel[]>();

  @Input() detail = false;
  @Input() clienType = '';
  @Input() searchBar = false;
  @Input() isWhite = false;
  searchTerm = 'recent products';

  @Input() url = '';
  merchantId = 1;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  searchInput = new FormControl('');
  products = [];
  response_data = 0;
  loader = false;
  productsNumber = 0;
  productPagination: Pagination = {
    filters: {
      limit: 12,
      offset: 0,
    },
  };
  paginationsLimit = [24, 12, 8];
  // pages: any;
  displayPaginationLimit = false;
  currentPage = 0;

  merchant: MerchantModel[] | [] | null = null;
  clientId$!: Observable<number>;
  clientId = 1;

  loadingProducts = true;

  countProductLoader = [1, 2, 3, 4, 5, 6, 7, 8];

  search = '';

  canMoveToNext = false;
  canMoveToPrevious = false;
  pages = 1;
  activePage = 1;

  constructor(
    private merchantService: MerchantService,
    // private route: ActivatedRoute,
    private apiService: ApiService,
    private configService: ConfigService,
    private authService: AuthService
    //   private generalService: GeneralService,
    //   private store: Store
  ) {
    this.clientId$ = this.authService.getUserClientId();
    this.theme$ = this.configService.getMode();
    // comment
  }
  ngOnInit(): void {
    // this.productPagination.filters!.limit = 8;
    // this.productPagination.filters = {
    //    limit: 8,
    //    offset: 0
    // }
    // this.clientId$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (clientId) => {
    //         this.clientId = clientId;
    //     },
    // });
    //   this.theme$.subscribe({
    //       next: (theme) => {
    //           this.theme = theme;
    //       },
    //   });

    this.getAllProducts('');

    //   this.variableService.search.pipe(takeUntil(this.onDestroy$)).subscribe({
    //       next: (search: any) => {
    //           this.getAllProducts(search);
    //       },
    //   });
  }

  getAllProducts(search: string) {
    if (!this.url) {
      this.loader = false;
      this.merchantService
        .searchProduct(this.productPagination, search)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: AllProductModel) => {
            (this.products as ProductModel[]) = data.objects;
            this.response_data = data.count;
            this.pages = Math.round(this.response_data / 6);
            if (
              this.response_data >
              parseInt(this.productPagination.filters!.limit as string)
            ) {
              this.canMoveToNext = true;
              this.loader = true;
            }
            this.loader = true;
            this.allProducts.emit(this.products);
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
            // if (this.productsNumber == 0) {
            //   console.log('Loading product');
            // }
          },
        });
    }
  }

  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    // condition just for typescript
    if (this.productPagination.filters!.limit) {
      this.productPagination.filters!.offset =
        (this.productPagination.filters!.limit as number) * this.currentPage;
      this.getAllProducts(this.search);
    }
  }
  openPagination() {
    if (this.displayPaginationLimit) {
      this.displayPaginationLimit = false;
    } else {
      this.displayPaginationLimit = true;
    }
  }

  selectPagintationLimit(pagination: number) {
    this.productPagination.filters!.limit = pagination;
    this.openPagination();
    this.getAllProducts(this.search);
  }

  canMoveNext(limit: number): boolean {
    return this.response_data < (this.currentPage + 1) * limit;
  }

  getPagination(action = 'next') {
    if (action === 'next') {
      this.activePage++;
    } else {
      this.activePage--;
    }
    // action === 'next' ? this.activePage++ : this.activePage--;
    if (this.activePage >= 1 && this.activePage <= this.pages) {
      const _offset = (
        parseInt(this.productPagination.filters?.limit as string) *
        (this.activePage - 1)
      ).toString();
      this.productPagination.filters!.offset = _offset;
      if (action === 'next') {
        this.getAllProducts(this.search);
      } else if (action === 'prev') {
        this.getAllProducts(this.search);
      }
      this.canMoveToNext = true;
      this.canMoveToPrevious = true;
    }
    if (this.activePage - 1 < 1) {
      this.productPagination.filters!.offset = '';
      this.canMoveToPrevious = false;
      this.canMoveToNext = false;
    } else if (this.activePage + 1 > this.pages) {
      this.canMoveToNext = false;
    }
  }

  selectProduct(event: ProductModel[]) {
    this.product.emit(event);
    console.log('PRoducts', this.product);
  }

  searchFor() {
    if (this.searchInput.value) {
      // this.variableService.search.next(this.searchInput.value);
    }
  }
}
