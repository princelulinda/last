import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { ProductCategoryModel, ProductOfferModel } from '../dashboard.model';
import { BillersModel, MerchantModel } from '../../merchant/merchant.models';
import { ProductAutocompleteModel } from '../../merchant/products/products.model';
import { MerchantAutocompleteModel } from '../../merchant/merchant.models';
import { MerchantService } from '../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../merchant/global/product-card/product-card.component';
import { MerchantCardComponent } from '../../merchant/global/merchant-card/merchant-card.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { BillerCardComponent } from '../../merchant/global/biller-card/biller-card.component';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    SkeletonComponent,
    ProductCardComponent,
    MerchantCardComponent,
    BillerCardComponent,
  ],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss',
})
export class MarketDashboardComponent implements OnInit, OnDestroy {
  newArrivalInfo = [
    {
      id: '1',
      name: 'Nike Air Jordan',
      storage: '257 Shop',
      cost: 'BIF 150,000',
      image:
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '2',
      name: 'Nike Air Jordan',
      storage: '257 Shop',
      cost: 'BIF 150,000',
      image:
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: '3',
      name: 'Nike Air Jordan',
      storage: '257 Shop',
      cost: 'BIF 150,000',
      image:
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  private onDestroy$: Subject<void> = new Subject<void>();

  favoriteMerchantLoading = false;
  favoriteMerchants!: MerchantModel[];
  favoriteMerchantsNumber!: number;
  favorite_merchant_making!: MerchantModel | null;

  merchants!: MerchantAutocompleteModel[];
  products!: ProductAutocompleteModel[];
  productCategory!: ProductCategoryModel[];
  last4Merchant!: MerchantAutocompleteModel[];
  recentMerchant!: MerchantAutocompleteModel[];
  recentBillers!: BillersModel[];
  first4ProductCategory!: ProductCategoryModel[];
  clearData = true;
  billerChecked = true;
  billers!: BillersModel[];
  loadingmerchants = true;
  offerData: { id: number; product: ProductOfferModel }[] = [];

  constructor(private merchantService: MerchantService) {}

  ngOnInit(): void {
    this.getMerchants('');
    this.getFavoriteMerchants('');
    this.getBrowseByCategory();
    this.getBestOfferData();
    this.getBillers();
    this.getRecentProducts();
  }
  getMakeFavoriteResponse(response: string) {
    const success = response;
    this.getMerchants('');
    this.getFavoriteMerchants('');
    console.log('response of getMakeFavoriteResponse', success);
  }
  getFavoriteMerchants(search: string, activeLoading = true) {
    console.log(activeLoading);
    this.merchantService
      .getFavoriteMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const data = response as { objects: MerchantModel[] };
          this.favoriteMerchants = data.objects;
          this.favoriteMerchantsNumber = data.objects.length;
          this.favoriteMerchantLoading = false;
          this.favorite_merchant_making = null;
        },
        error: err => {
          this.favoriteMerchantLoading = false;
          console.log(err);
        },
      });
  }

  getMerchants(search: string) {
    this.merchantService
      .getRecentMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: MerchantAutocompleteModel[] };
          this.merchants = response.objects;
          this.last4Merchant = this.merchants.slice(-4);

          this.recentMerchant = this.merchants.slice(0, 4);

          this.favorite_merchant_making = null;
        },
      });
  }

  getBillers() {
    console.log('getBillers called');
    this.merchantService
      .getBIllers(this.billerChecked)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const result = response as { objects: BillersModel[] };
          this.billers = result.objects;
          this.recentBillers = this.billers.slice(0, 4);
        },
        error: () => {
          this.loadingmerchants = false;
        },
      });
  }
  getBrowseByCategory() {
    this.merchantService
      .getBrowseByCategory()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const response = result as { objects: ProductCategoryModel[] };
          this.productCategory = response.objects;
          this.first4ProductCategory = this.productCategory.slice(0, 4);
        },
      });
  }

  getBestOfferData() {
    this.merchantService
      .getBestOffer()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const data = response as {
            objects: { id: number; product: ProductOfferModel }[];
          };
          this.offerData = data.objects.slice(0, 2);
        },
        error: err => {
          console.log('erreur sur best offer', err);
        },
      });
  }

  getRecentProducts() {
    this.merchantService
      .getRecentProducts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: ProductAutocompleteModel[] };
          this.products = response.objects.slice(0, 4);
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
