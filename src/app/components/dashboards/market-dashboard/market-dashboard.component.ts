import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Subject, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss',
})
export class MarketDashboardComponent {
  billersList = [
    { id: '1', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '2', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '3', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '4', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '5', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
  ];

  // private onDestroy$: Subject<void> = new Subject<void>();
  // // private variableService = inject(VariableService);

  // clientId$!: Observable<any>;
  // clientId: any;

  // favoriteMerchantLoading = false;
  // favoriteMerchants: any;
  // favoriteMerchantsNumber: any;
  // favorite_merchants: any;
  // favorite_making = true;
  // favorite_merchant_making: any;

  // activities: any = [];
  // merchants: any;
  // biller: any;
  // sector: any;
  // last4: any;
  // first6: any;
  // clearData = true;
  // billerChecked = true;
  // billers: any;
  // merchantDetail = false;
  // categorySections = false;
  // loadingmerchants = true;
  // merchantId: any;
  // merchantDetails: any;
  // payMerchant: any;
  // merchantSelected: any;
  // categorySelected: any;
  // category: { sector: any; category: any } = { sector: null, category: null };
  // payment: any;

  // constructor(
  //     // private merchantService: MerchantService,
  //     // private store: Store
  // ) {
  //     // this.clientId$ = this.store.select(AuthState.GetClientId);
  //     // comment
  // }

  // ngOnInit(): void {
  //     // this.getMerchants('');
  //     this.getFavoriteMerchants('');
  //     // this.getSectorsAndCategories();
  //     // this.getBillers();

  //     this.clientId$.pipe(takeUntil(this.onDestroy$)).subscribe({
  //         next: (clientId: any) => {
  //             this.clientId = clientId;
  //             // this.getMerchant('');
  //         },
  //     });

  //     // this.variableService.search.pipe(takeUntil(this.onDestroy$)).subscribe({
  //     //     next: (search: any) => {
  //     //         this.getMerchants(search);
  //     //     },
  //     // });
  // }
  // getFavoriteMerchants(search: string, activeLoading = true) {
  //     activeLoading ? (this.favoriteMerchantLoading = true) : false;
  //     // this.merchantService
  //     //     .getFavoriteMerchantsAutocomplete(search)
  //     //     .pipe(takeUntil(this.onDestroy$))
  //     //     .subscribe({
  //     //         next: (data) => {
  //     //             this.favoriteMerchants = data.objects;
  //     //             this.favoriteMerchantsNumber = data.count;
  //     //             this.favoriteMerchantLoading = false;
  //     //             this.favorite_merchant_making = null;
  //     //         },
  //     //         error: (err) => {
  //     //             this.favoriteMerchantLoading = false;
  //     //         },
  //     //     });
  // }

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

  // openModal(merchant: any, event: any) {
  //     this.payMerchant = merchant;
  //     this.biller = null;
  //     this.categorySelected = null;
  //     this.merchantId = this.payMerchant.id;
  //     this.clearData = true;

  //     event.stopPropagation();
  //     // add data-bs after click on favorite star
  //     const element = event.target as HTMLButtonElement;
  //     element.setAttribute('data-bs-toggle', 'modal');
  //     element.setAttribute('data-bs-target', '#merchantModal');
  //     element.click();
  //     // accepts_simple_payment;
  //     // this.getMerchantDetails();
  // }

  // goBack() {
  //     this.sector = true;
  //     this.merchantDetail = false;
  //     this.categorySections = false;
  // }

  // // getMerchants(search: string) {
  // //     this.merchantService
  // //         .getMerchantsAutocomplete(search)
  // //         .pipe(takeUntil(this.onDestroy$))
  // //         .subscribe({
  // //             next: (data) => {
  // //                 this.merchants = data.objects;
  // //                 // this.merchant = this.merchants;
  // //                 this.last4 = this.merchants.slice(-4);
  // //                 this.first6 = this.merchants.slice(0, 6);
  // //                 this.favorite_merchant_making = null;
  // //             },
  // //         });
  // // }
  // // getBillers() {
  // //     this.merchantService
  // //         .getBIllers(this.billerChecked)
  // //         .pipe(takeUntil(this.onDestroy$))
  // //         .subscribe({
  // //             next: (response: any) => {
  // //                 this.billers = response.objects;
  // //             },
  // //             error: (error) => {
  // //                 this.loadingmerchants = false;
  // //             },
  // //         });
  // // }

  // // getMerchantDetails() {
  // //     this.merchantService
  // //         .getMerchantsDetails(this.merchantId)
  // //         .pipe(takeUntil(this.onDestroy$))
  // //         .subscribe({
  // //             next: (data) => {
  // //                 this.clearData = false;
  // //                 this.merchantDetails = data.object;
  // //                 // this.merchant = this.merchantDetails;
  // //             },
  // //         });
  // // }

  // makeFavoriteMerchants(favorite: any, event: any) {
  //     event.stopPropagation();
  //     const productCard: HTMLElement =
  //         event.target.parentElement.parentElement.parentElement.parentElement
  //             .parentElement;
  //     // remove data-bs for bootstrap modal
  //     productCard.removeAttribute('data-bs-target');
  //     productCard.removeAttribute('data-bs-toggle');
  //     this.favorite_merchant_making = favorite;
  //     this.favorite_making = false;
  //     let body;
  //     if (!favorite.is_favorite_merchant) {
  //         body = {
  //             merchant: favorite.id,
  //             merchant_action: 'make_favorite',
  //         };
  //     } else if (favorite.is_favorite_merchant) {
  //         body = {
  //             merchant: favorite.id,
  //             merchant_action: 'revoke_favorite',
  //         };
  //     }

  //     // add data-bs after click on favorite star
  //     productCard.setAttribute('data-bs-target', '#myModal');
  //     productCard.setAttribute('data-bs-toggle', 'modal');
  //     // this.merchantService
  //     //     .makeFavoriteMerchants(body)
  //     //     .pipe(takeUntil(this.onDestroy$))
  //     //     .subscribe({
  //     //         next: (data) => {
  //     //             const response = data.object;
  //     //             if (response.success) {
  //     //                 this.getMerchants('');
  //     //                 this.getFavoriteMerchants('');
  //     //             }
  //     //         },
  //     //     });
  // }
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
