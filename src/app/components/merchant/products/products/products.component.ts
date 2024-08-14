import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../global/product-card/product-card.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { AllProductsComponent } from '../all-products/all-products.component';
import { AllProductModel, ProductModel } from '../products.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { ConfigService } from '../../../../core/services';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';

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
  products: ProductModel[] = [];
  product!: ProductModel;
  isLoading!: boolean;
  favoriteProducts: ProductModel[] = [];
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  seeMore!: boolean;
  searchTerm = 'favorites products';

  itemQuantity = 1;
  merchant = '';
  cartAdding = 0;
  count = 0;
  countProductLoader: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  constructor(
    private merchantService: MerchantService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
  }
  ngOnInit(): void {
    // comment
    // console.log('d product 33', this.product);
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: response => {
        this.theme = response;
      },
    });
    this.getFavoriteProducts('');
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
  selectProduct(product: ProductModel) {
    (this.product as ProductModel) = product;
    console.log('PRoduct', product);
  }
  selectProductFromAll(event: ProductModel) {
    this.product = event;
    console.log('PRoducts', event);
  }
  getAllProduct(event: AllProductModel[]) {
    this.isLoading = true;
    (this.allProduct as AllProductModel[]) = event;
    console.log('allproducts', this.allProduct);
  }

  getFavoriteProducts(search: string) {
    this.merchantService
      .getFavoriteProductAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: AllProductModel) => {
          (this.products as ProductModel[]) = data.objects;
          this.favoriteProducts = this.products.filter(
            product => product.is_favorite_product
          );
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
