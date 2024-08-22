import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../global/product-card/product-card.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { AllProductsComponent } from '../all-products/all-products.component';
import {
  AllProductAutocompleteModel,
  ProductAutocompleteModel,
} from '../products.model';
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

  allProduct = [];
  products: ProductAutocompleteModel[] = [];
  product!: ProductAutocompleteModel;
  isLoading!: boolean;
  favoriteProducts: ProductAutocompleteModel[] = [];
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  seeMore!: boolean;
  searchTerm = 'favorites products';

  itemQuantity = 1;
  merchant = '';
  cartAdding = 0;
  count = 0;
  countProductLoader: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

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
    // this.variableService.isFavorite$.subscribe(() => {
    //   this.getFavoriteProducts('');
    // });
  }
  addItemQuantity() {
    this.itemQuantity = this.itemQuantity + 1;
  }
  removeItemQuantity() {
    this.itemQuantity = this.itemQuantity - 1;
  }
  addToCart() {
    this.cartAdding = this.cartAdding + 1;
  }
  inputDetails() {
    this.cartItem.emit(this.cartAdding);
  }
  selectProduct(product: ProductAutocompleteModel) {
    (this.product as ProductAutocompleteModel) = product;
    console.log('PRoduct', product);
  }
  selectProductFromAll(event: ProductAutocompleteModel) {
    this.product = event;
    console.log('PRoducts', event);
  }
  getAllProduct(event: AllProductAutocompleteModel[]) {
    this.isLoading = true;
    (this.allProduct as AllProductAutocompleteModel[]) = event;
    console.log('allproducts', this.allProduct);
  }

  getFavoriteProducts(search: string) {
    this.isLoading = false;
    this.merchantService
      .getFavoriteProductAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: AllProductAutocompleteModel) => {
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
}
