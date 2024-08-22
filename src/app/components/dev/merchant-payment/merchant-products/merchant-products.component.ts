import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../../core/services';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ProductCardComponent } from '../../../merchant/global/product-card/product-card.component';
import { ProductAutocompleteModel } from '../../../merchant/products/products.model';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-merchant-products',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent,
    ProductCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './merchant-products.component.html',
  styleUrl: './merchant-products.component.scss',
})
export class MerchantProductsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) merchantId!: number;
  products: ProductAutocompleteModel[] = [];
  isLoading = true;

  @Output() selectedProductEvent = new EventEmitter<ProductAutocompleteModel>();

  constructor(private merchantService: MerchantService) {}

  ngOnInit() {
    this.getMerchantProducts();
  }

  getMerchantProducts() {
    this.merchantService
      .getMerchantProducts(this.merchantId?.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: products => {
          this.products = products.objects;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  setSelectedProduct(product: ProductAutocompleteModel) {
    console.log(product);
    this.selectedProductEvent.emit(product);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
