import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { ProductCategoryModel, ProductOfferModel } from '../../dashboard.model';
import {
  BillersAutocompleteModel,
  MerchantModel,
} from '../../../merchant/merchant.models';
import { ProductAutocompleteModel } from '../../../merchant/products/products.model';
import { MerchantAutocompleteModel } from '../../../merchant/merchant.models';
import { MerchantService } from '../../../../core/services/merchant/merchant.service';
import { ProductCardComponent } from '../../../merchant/global/product-card/product-card.component';
import { MerchantCardComponent } from '../../../merchant/global/merchant-card/merchant-card.component';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { BillerCardComponent } from '../../../merchant/global/biller-card/biller-card.component';
import { DialogService } from '../../../../core/services';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { CurrencyModel } from '../../../../global/models/global.models';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    SkeletonComponent,
    ProductCardComponent,
    MerchantCardComponent,
    BillerCardComponent,
    AmountVisibilityComponent,
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
  favoriteMerchants!: MerchantAutocompleteModel[];
  favoriteMerchantsNumber!: number;
  favorite_merchant_making!: MerchantModel | null;

  merchants!: MerchantAutocompleteModel[];
  products!: ProductAutocompleteModel[];
  productCategory!: ProductCategoryModel[];
  last4Merchant!: MerchantAutocompleteModel[];
  recentMerchant!: MerchantAutocompleteModel[];
  recentBillers!: BillersAutocompleteModel[];
  first4ProductCategory!: ProductCategoryModel[];
  clearData = true;
  billerChecked = true;
  billers!: BillersAutocompleteModel[];
  merchantDetail = false;
  // categorySections = false;
  loadingmerchants = true;
  offerData: { id: number; product: ProductOfferModel }[] = [];
  balance_currency: CurrencyModel = 'BIF';

  constructor(
    private merchantService: MerchantService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getMerchants('');
    this.getFavoriteMerchants('');
    this.getBrowseByCategory();
    this.getBestOfferData();
    this.getBillers();
    this.getRecentProducts();
  }
  getMakeFavoriteResponse() {
    this.getMerchants('');
    this.getFavoriteMerchants('');
  }
  getFavoriteMerchants(search: string) {
    this.merchantService
      .getFavoriteMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: {
          objects: MerchantAutocompleteModel[];
          count: number;
        }) => {
          this.favoriteMerchants = data.objects;
          this.favoriteMerchantsNumber = data.objects.length;
          this.favoriteMerchantLoading = false;
          this.favorite_merchant_making = null;
        },
        error: () => {
          this.favoriteMerchantLoading = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: 'failed to get a favorite merchant',
          });
        },
      });
  }

  getMerchants(search: string) {
    this.merchantService
      .getRecentMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.merchants = response.objects;
          this.last4Merchant = this.merchants.slice(-5);

          this.recentMerchant = this.merchants.slice(0, 5);

          this.favorite_merchant_making = null;
        },
      });
  }

  getBillers() {
    this.merchantService
      .getBIllers(this.billerChecked)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (result: { objects: BillersAutocompleteModel[] }) => {
          this.billers = result.objects;
          this.recentBillers = this.billers.slice(0, 5);
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
        next: (response: { objects: ProductCategoryModel[] }) => {
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
        next: (data: {
          objects: { id: number; product: ProductOfferModel }[];
        }) => {
          this.offerData = data.objects.slice(0, 2);
        },
        error: () => {
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message: 'failed to get best offer',
          });
        },
      });
  }

  getRecentProducts() {
    this.merchantService
      .getRecentProducts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: { objects: ProductAutocompleteModel[] }) => {
          this.products = response.objects.slice(0, 5);
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
