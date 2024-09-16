import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import {
  ApiService,
  AuthService,
  ConfigService,
} from '../../../../core/services';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ProductAutocompleteModel } from '../products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { ProductCardComponent } from '../../global/product-card/product-card.component';
import { MerchantModel } from '../../merchant.models';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    ProductCardComponent,
    FormsModule,
    ReactiveFormsModule,
    EmptyStateComponent,
    PaginationComponent,
  ],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss',
})
export class AllProductsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Output() allProducts = new EventEmitter<
    { objects: ProductAutocompleteModel[]; count: number }[]
  >();
  @Output() product = new EventEmitter<ProductAutocompleteModel>();

  @Input() detail = false;
  @Input() clienType = '';
  @Input() searchBar = false;
  @Input() isWhite = false;
  searchTerm = 'products';

  @Input() url = '';
  merchantId = 1;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  searchInput = new FormControl('');
  products = [];
  response_data = 0;
  loader = true;
  productPagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };

  merchant: MerchantModel[] | [] | null = null;
  clientId$!: Observable<number>;
  clientId = 1;

  countProductLoader = [1, 2, 3, 4, 5, 6, 7, 8];

  search = '';

  activePage = 1;

  constructor(
    private merchantService: MerchantService,
    private apiService: ApiService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.clientId$ = this.authService.getUserClientId();
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    this.getAllProducts('');
  }

  getAllProducts(search: string) {
    if (!this.url) {
      this.loader = true;
      this.merchantService
        .searchProduct(this.productPagination, search)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: data => {
            (this.products as ProductAutocompleteModel[]) = data.objects;
            this.response_data = data.count;
            this.loader = false;
            this.allProducts.emit(this.products);
          },
        });
    } else {
      const params = new HttpParams()
        .set('limit', this.productPagination.filters.limit)
        .set('offset', this.productPagination.filters.offset);
      this.loader = true;
      this.apiService
        .get<{ objects: ProductAutocompleteModel[]; count: number }>(
          this.url,
          params
        )
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: data => {
            (this.products as ProductAutocompleteModel[]) = data.objects;
            this.loader = false;
            this.response_data = data.count;
            this.allProducts.emit(this.products);
          },
        });
    }
  }

  selectProduct(event: ProductAutocompleteModel) {
    this.product.emit(event);
  }

  searchFor() {
    if (this.searchInput.value) {
      // this.variableService.search.next(this.searchInput.value);
    }
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.productPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getAllProducts(this.search);
  }
}
