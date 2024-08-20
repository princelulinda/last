import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { ProductModel } from '../../../dashboards/dashboard.model';
import { MerchantService } from '../../../../core/services';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ProductCardComponent } from '../../../merchant/global/product-card/product-card.component';

@Component({
  selector: 'app-merchant-products',
  standalone: true,
  imports: [CommonModule, SkeletonComponent, ProductCardComponent],
  templateUrl: './merchant-products.component.html',
  styleUrl: './merchant-products.component.scss',
})
export class MerchantProductsComponent implements OnInit, OnDestroy {
  @Input() merchantId = 0;
  products!: ProductModel[];
  isLoading = true;

  constructor(private merchantService: MerchantService) {}
  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit() {
    this.merchantService
      .getProductsByMerchant(this.merchantId.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: products => {
          const results = products as { objects: ProductModel[] };
          this.products = results.objects;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
