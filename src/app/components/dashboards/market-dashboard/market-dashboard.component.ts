import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { ProductCardComponent } from '../../dev/product-card/product-card.component';
import { MerchantCardComponent } from '../../dev/merchant-card/merchant-card.component';
// import { Subject, Observable, takeUntil } from 'rxjs';
// import { MerchantService } from '../../../core/services/merchant/merchant.service';

@Component({
  selector: 'app-market-dashboard',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, MerchantCardComponent],
  templateUrl: './market-dashboard.component.html',
  styleUrl: './market-dashboard.component.scss',
})
export class MarketDashboardComponent {
  shoeCardInfo = [
    {
      id: '1',
      offerPourcent: '15% Discount',
      offerInfo: 'Buy new Nike Air Jordan and get up to 15% discount',
      image:
        'https://images.pexels.com/photos/786003/pexels-photo-786003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '2',
      offerPourcent: '15% Discount',
      offerInfo: 'Buy new Nike Air Jordan and get up to 15% discount',
      image:
        'https://images.pexels.com/photos/786003/pexels-photo-786003.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];
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
  billersList = [
    { id: '1', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '2', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '3', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
    { id: '4', image: '/images/obr.png', banque: 'OBR', comptNum: '34567' },
  ];

  private onDestroy$: Subject<void> = new Subject<void>();
  // // private variableService = inject(VariableService);

  clientId$!: Observable<string>;
  clientId!: string;

  favoriteMerchantLoading = false;
  // favoriteMerchants: any;
  // favoriteMerchantsNumber: any;
  // favorite_merchants: any;
  favorite_making = true;
  // favorite_merchant_making: any;

  // activities: any = [];
  merchants!: [];
  biller!: [];
  // sector: any;
  // last4: any;
  // first6: any;
  clearData = true;
  billerChecked = true;
  billers!: [];
  merchantDetail = false;
  // categorySections = false;
  loadingmerchants = true;
  merchantId!: string;
  merchantDetails!: [];
  // payMerchant: any;
  // merchantSelected: any;
  // categorySelected: any;
  // category: { sector: any; category: any } = { sector: null, category: null };
  // payment: any;

  constructor() {
    // private store: Store //   private merchantService: MerchantService,
    // this.clientId$ = this.store.select(AuthState.GetClientId);
    // comment
  }

  //   ngOnInit(): void {
  //       // this.getMerchants('');
  //       // this.getFavoriteMerchants('');
  //       // this.getSectorsAndCategories();
  //     //   this.getBillers();

  //       this.clientId$.pipe(takeUntil(this.onDestroy$)).subscribe({
  //           next: (clientId: string) => {
  //               this.clientId = clientId;
  //               // this.getMerchant('');
  //           },
  //       });

  //       // this.variableService.search.pipe(takeUntil(this.onDestroy$)).subscribe({
  //       //     next: (search: any) => {
  //       //         this.getMerchants(search);
  //       //     },
  //       // });
  //   }
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

  /**can be work if u add interface for biller
   */
  //   getBillers() {
  //       this.merchantService
  //           .getBIllers(this.billerChecked)
  //           .pipe(takeUntil(this.onDestroy$))
  //           .subscribe({
  //               next: (response: any) => {
  //                   this.billers = response.objects;
  //               },
  //               error: (error) => {
  //                   this.loadingmerchants = false;
  //                   console.log(error)
  //               },
  //           });
  //   }

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
