import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

// import { MerchantService } from 'src/app/core/services/merchant.service';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../../dev/product-card/product-card.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { AllProductsComponent } from '../all-products/all-products.component';
import { AllProductModel, ProductModel } from '../products.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SkeletonComponent,
    AllProductsComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Output() cartItem = new EventEmitter<number>();
  private onDestroy$: Subject<void> = new Subject<void>();

  allProduct = [];
  product = [];
  isLoading!: boolean;

  itemQuantity = 1;
  merchant = '';
  cartAdding = 0;
  countProductLoader: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private merchantService: MerchantService) {
    // comment
  }
  ngOnInit(): void {
    // comment
    console.log('d product 33', this.product);
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
  selectProduct(product: ProductModel[]) {
    (this.product as ProductModel[]) = product;
    console.log('PRoduct', product);
  }
  selectProductFromAll(event: ProductModel[]) {
    (this.product as ProductModel[]) = event;
    console.log('PRoducts', event);
  }
  getAllProduct(event: AllProductModel[]) {
    this.isLoading = true;
    (this.allProduct as AllProductModel[]) = event;
    console.log('allproducts', this.allProduct);
  }
}
