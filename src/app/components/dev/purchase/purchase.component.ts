import { Component, OnInit } from '@angular/core';
import { DialogService, MerchantService } from '../../../core/services';
import { ProductAutocompleteModel } from '../../merchant/products/products.model';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../merchant/global/product-card/product-card.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../global/components/empty-states/empty-state/empty-state.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProductCardComponent,
    SkeletonComponent,
    EmptyStateComponent,
    RouterLink,
  ],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  merchantId!: string;
  search = new FormControl('');
  products: ProductAutocompleteModel[] = [];
  isLoading = true;
  searchType: EmptyStateModel = 'product';
  isProductsSearch = false;
  disabledFavoriteAction = false;

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {}
  ngOnInit() {
    this.getConnectedMerchantInfo();
  }

  getConnectedMerchantInfo() {
    this.merchantService.getConnectedMerchantInfo().subscribe(merchantInfo => {
      this.merchantId = merchantInfo.object.response_data.id;

      this.merchantService.getConnectedMerchantId(this.merchantId);
      this.getPurchasedProducts();
    });
  }
  getPurchasedProducts(search?: string) {
    this.isLoading = true;
    this.search.patchValue('');
    this.products = [];
    this.merchantService
      .getPurchasedProducts(this.merchantId, search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const result = data as { objects: ProductAutocompleteModel[] };
          this.products = result.objects;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: $localize`Something went wrong please retry again !`,
          });
        },
      });
  }

  searchProducts(search: string | null) {
    this.products = [];
    this.isLoading = true;
    this.isProductsSearch = true;

    if (search) {
      this.merchantService
        .getPurchasedProducts(this.merchantId, search)
        .subscribe({
          next: data => {
            const result = data as { objects: ProductAutocompleteModel[] };
            this.products = [];
            this.products = result.objects;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.dialogService.openToast({
              type: 'failed',
              title: '',
              message: 'failed to get products',
            });
          },
        });
    } else {
      this.getPurchasedProducts();
    }
  }
}
