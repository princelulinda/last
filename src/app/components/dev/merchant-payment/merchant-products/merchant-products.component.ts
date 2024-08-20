import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../../core/services';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ProductCardComponent } from '../../../merchant/global/product-card/product-card.component';
import { ProductAutocompleteModel } from '../../../merchant/products/products.model';

@Component({
  selector: 'app-merchant-products',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, ProductCardComponent],
  templateUrl: './merchant-products.component.html',
  styleUrl: './merchant-products.component.scss',
})
export class MerchantProductsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) merchantId!: number;
  products: ProductAutocompleteModel[] = [];
  isLoading = true;

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

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
