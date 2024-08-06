import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../../dev/product-card/product-card.component';
import { MerchantCardComponent } from '../../dev/merchant-card/merchant-card.component';
import { MerchantService } from '../../../core/services/merchant/merchant.service';
import {
  BestOfferModel,
  BillersModel,
  objectsModel,
  productCategoryArray,
  productCategoryModel,
  ProductModel,
} from '../dashboard.model';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { Merchant_AutocompleteModel } from '../../dev/merchant-card/merchant.model';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    SkeletonComponent,
    ProductCardComponent,
    MerchantCardComponent,
  ],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss',
})
export class MarketDashboardComponent implements OnInit {
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
  // // private variableService = inject(VariableService);

  // clientId$!: Observable<string>;
  // clientId!: string;

  favoriteMerchantLoading = false;
  favoriteMerchants!: BillersModel[];
  favoriteMerchantsNumber!: number;
  favorite_merchants!: BillersModel;
  favorite_making = true;
  favorite_merchant_making!: BillersModel | null;

  // activities: any = [];
  merchants!: Merchant_AutocompleteModel[];
  products!: ProductModel[];
  biller: [] | null = null;
  productCategory!: productCategoryModel[];
  // sector: any;
  last4Merchant!: Merchant_AutocompleteModel[];
  recentMerchant!: Merchant_AutocompleteModel[];
  recentBillers!: BillersModel[];
  first4ProductCategory!: productCategoryModel[];
  start = 0;
  end = 4;
  clearData = true;
  billerChecked = true;
  billers!: BillersModel[];
  merchantDetail = false;
  // categorySections = false;
  loadingmerchants = true;
  merchantId!: string;
  merchantDetails!: [];
  // payMerchant: any;
  // merchantSelected: any;
  categorySelected!: null;
  // category: { sector: any; category: any } = { sector: null, category: null };
  // payment: any;
  offerData: BestOfferModel[] = [];
  first2: BestOfferModel[] = [];

  constructor(private merchantService: MerchantService) {
    // private store: Store
    // this.clientId$ = this.store.select(AuthState.GetClientId);
    // comment
  }

  ngOnInit(): void {
    this.getMerchants('');
    this.getFavoriteMerchants('');
    this.getBrowseByCategory();
    this.getBestOfferData();
    // this.getSearchProduct('');
    // this.getSectorsAndCategories();
    this.getBillers();
    this.getRecentProducts();

    // this.clientId$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //   next: (id: string) => {
    //     this.clientId = id;
    //     this.getMerchant('');
    //   },
    // });

    // this.variableService.search.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (search: any) => {
    //         this.getMerchants(search);
    //     },
    // });
  }
  getMakeFavoriteResponse(response: string) {
    const success = response;
    this.getMerchants('');
    this.getFavoriteMerchants('');
    console.log(
      '============================================>success value',
      success
    );
  }
  getFavoriteMerchants(search: string, activeLoading = true) {
    // activeLoading ? (this.favoriteMerchantLoading = true) : false;
    console.log(activeLoading);
    this.merchantService
      .getFavoriteMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const data = response as objectsModel;
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

  // selectMerchant(category: any, merchant: any) {
  //     this.biller = null;
  //     this.merchantSelected = merchant;
  //     this.categorySelected = category;
  //     this.sector = false;
  //     this.merchantDetail = true;
  //     this.categorySections = false;
  // }

  // selectCategory(category: any) {
  //     this.categorySelected = category;
  //     this.categorySections = true;
  //     this.merchantDetail = false;
  //     this.biller = null;
  //     this.payMerchant = null;
  // }

  // // selectBiller(biller: any) {
  // //     this.payMerchant = null;
  // //     this.categorySelected = null;
  // //     this.biller = biller;
  // // }

  openModal(merchant: BillersModel, event: Event) {
    // this.payMerchant = merchant;
    console.log(merchant);
    this.biller = null;
    this.categorySelected = null;
    // this.merchantId = this.payMerchant.id;
    this.clearData = true;

    event.stopPropagation();
    // add data-bs after click on favorite star
    const element = event.target as HTMLButtonElement;
    element.setAttribute('data-bs-toggle', 'modal');
    element.setAttribute('data-bs-target', '#merchantModal');
    element.click();
    // accepts_simple_payment;
    // this.getMerchantDetails();
  }

  // goBack() {
  //     this.sector = true;
  //     this.merchantDetail = false;
  //     this.categorySections = false;
  // }
  nextMerchant() {
    if (this.end < this.merchants.length) {
      this.start++;
      this.end++;
      this.recentMerchant = this.merchants.slice(this.start, this.end);
    }
  }
  previousMerchant() {
    if (this.start > 0) {
      this.start--;
      this.end--;
      this.recentMerchant = this.merchants.slice(this.start, this.end);
    }
  }

  getMerchants(search: string) {
    this.merchantService
      .getMerchantsAutocomplete(search)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: Merchant_AutocompleteModel[] };
          this.merchants = response.objects;
          // this.merchant = this.merchants;
          this.last4Merchant = this.merchants.slice(-4);
          const navigationBtn = document.getElementById(
            'navigationButtonMerchant'
          );
          this.recentMerchant = this.merchants.slice(this.start, this.end);
          navigationBtn?.addEventListener('click', () => {
            this.nextMerchant();
            this.previousMerchant();
          });
          this.favorite_merchant_making = null;
        },
      });
  }

  // getProduct(data: any) {
  //   this.merchantService.searchProductByMerchant(data).pipe(takeUntil(this.onDestroy$)).subscribe({
  //     next: (result: any) => {
  //       this.products = result.objects;
  //       this.first6 = this.merchants.slice(0,4);
  //       console.log('this is first66-----:', this.first6);

  //     }
  //   })
  // }

  /**can be work if u add interface for biller
   */
  nextBiller() {
    if (this.end < this.billers.length) {
      this.start++;
      this.end++;
      this.recentBillers = this.billers.slice(this.start, this.end);
    }
  }
  previousBiller() {
    if (this.start > 0) {
      this.start--;
      this.end--;
      this.recentBillers = this.billers.slice(this.start, this.end);
    }
  }
  getBillers() {
    console.log('getBillers called');
    this.merchantService
      .getBIllers(this.billerChecked)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          const result = response as objectsModel;
          this.billers = result.objects;

          const nextBtn = document.getElementById('navigationButton');
          this.recentBillers = this.billers.slice(this.start, this.end);
          nextBtn?.addEventListener('click', () => {
            this.nextBiller();
            this.previousBiller();
          });
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
          const response = result as productCategoryArray;
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
          const data = response as { objects: BestOfferModel[] };
          this.offerData = data.objects.slice(0, 2);
        },
        // error: (err: HttpErrorResponse) => {
        //   if (this.offerData.length === 0) {
        //     console.log('erreur sur best offer', err);
        //   }
        // },
      });
  }

  getRecentProducts() {
    this.merchantService
      .getRecentProducts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: ProductModel[] };
          this.products = response.objects.slice(0, 4);
        },
      });
  }

  //   getMerchantDetails() {
  //       this.merchantService
  //           .getMerchantsDetails(this.merchantId)
  //           .pipe(takeUntil(this.onDestroy$))
  //           .subscribe({
  //               // next: (data) => {
  //               //     this.clearData = false;
  //               //     this.merchantDetails = data.object;
  //               //     this.merchant = this.merchantDetails;
  //               // },
  //           });
  //   }

  /********************************************************************** */
  // makeFavoriteMerchants(favorite: BillersModel, event: Event) {
  //   event.stopPropagation();
  //   // const productCard: HTMLElement =
  //   //     event.target?.parentElement.parentElement.parentElement.parentElement
  //   //         .parentElement;
  //   // remove data-bs for bootstrap modal
  //   // productCard.removeAttribute('data-bs-target');
  //   // productCard.removeAttribute('data-bs-toggle');
  //   this.favorite_merchant_making = favorite;
  //   this.favorite_making = false;
  //   let body!: Favorite;
  //   if (!favorite.is_favorite_merchant) {
  //     body = {
  //       merchant: favorite.id,
  //       merchant_action: 'make_favorite',
  //     };
  //   } else if (favorite.is_favorite_merchant) {
  //     body = {
  //       merchant: favorite.id,
  //       merchant_action: 'revoke_favorite',
  //     };
  //   }

  //   // add data-bs after click on favorite star
  //   // productCard.setAttribute('data-bs-target', '#myModal');
  //   // productCard.setAttribute('data-bs-toggle', 'modal');
  //   this.merchantService
  //     .makeFavoriteMerchants(body)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: result => {
  //         const data = result as objectModel;
  //         const response = data.object;
  //         if (response.success) {
  //           this.getMakeFavoriteResponse(response.success);
  //         }
  //       },
  //     });
  // }
  /*********call product api **********************************************************/
  // getSearchProduct(data: any) {
  //   this.merchantService.searchProductByMerchant(data).pipe(takeUntil(this.onDestroy$)).subscribe({
  //     next: (result: any) =>{
  //       const response = result.object;
  //       this.products = response;
  //       console.log('=========this is products result:',this.products);

  //     }
  //   })
  // }
  /******************************************************************************** */
  // // getSectorsAndCategories() {
  // //     this.merchantService.getActivitySectors().subscribe({
  // //         next: (data) => {
  // //             const activities: any[] = [];
  // //             data.objects.forEach((activity: any) => {
  // //                 const data: any = {};
  // //                 data['activity'] = activity;
  // //                 this.merchantService
  // //                     .getCategoriesPerActivitySectors(activity.id)
  // //                     .subscribe({
  // //                         next: (sectors) => {
  // //                             data['categories'] = sectors;
  // //                         },
  // //                     });
  // //                 activities.push(data);
  // //             });
  // //             this.activities = activities;
  // //             this.sector = activities;
  // //         },
  // //     });
  // // }

  // sendSectorAndCategoryInPopup(sector: any, category: any) {
  //     this.categorySelected = true;
  //     this.biller = null;
  //     this.payMerchant = null;
  //     this.category = { sector: sector, category: category };
  // }
  // ngOnDestroy(): void {
  //     this.onDestroy$.next();
  //     this.onDestroy$.complete();
  // }
}
