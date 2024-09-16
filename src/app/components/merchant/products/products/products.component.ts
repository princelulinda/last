import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../global/product-card/product-card.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { AllProductsComponent } from '../all-products/all-products.component';
import { ProductAutocompleteModel } from '../products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { ConfigService } from '../../../../core/services';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { VariableService } from '../../../../core/services/variable/variable.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SkeletonComponent,
    AllProductsComponent,
    EmptyStateComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Output() cartItem = new EventEmitter<number>();
  private onDestroy$: Subject<void> = new Subject<void>();

  allProduct!: { objects: ProductAutocompleteModel[]; count: number }[];
  products: ProductAutocompleteModel[] = [];
  product!: ProductAutocompleteModel;
  isLoading!: boolean;
  favoriteProducts: ProductAutocompleteModel[] = [];
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  searchTerm = 'favorites products';

  countProductLoader: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  favoriteDisplay = false;

  private refreshFavoriteProducts$: Observable<boolean>;

  constructor(
    private merchantService: MerchantService,
    private configService: ConfigService,
    private variableService: VariableService
  ) {
    this.theme$ = this.configService.getMode();
    this.refreshFavoriteProducts$ = toObservable(
      this.variableService.refreshFavoriteProducts
    );
  }
  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: response => {
        this.theme = response;
      },
    });

    // NOTE :: TO CHECK ACTION ON FAVORITE PRODUCTS
    this.refreshFavoriteProducts$.subscribe({
      next: state => {
        if (state) {
          this.getFavoriteProducts('');
          this.variableService.refreshFavoriteProducts.set(false);
        }
      },
    });
    this.getFavoriteProducts('');
  }

  selectProduct(product: ProductAutocompleteModel) {
    (this.product as ProductAutocompleteModel) = product;
  }
  selectProductFromAll(event: ProductAutocompleteModel) {
    this.product = event;
  }
  getAllProduct(
    event: { objects: ProductAutocompleteModel[]; count: number }[]
  ) {
    this.isLoading = true;
    this.allProduct = event;
  }

  getFavoriteProducts(search: string) {
    this.isLoading = false;
    this.merchantService
      .getFavoriteProductAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          (this.products as ProductAutocompleteModel[]) = data.objects;
          this.favoriteProducts = this.products.filter(
            product => product.is_favorite_product
          );
          this.isLoading = true;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  displayFavorites() {
    if (!this.favoriteDisplay) {
      this.favoriteDisplay = true;
    } else if (this.favoriteDisplay) {
      this.favoriteDisplay = false;
    }
  }
}
