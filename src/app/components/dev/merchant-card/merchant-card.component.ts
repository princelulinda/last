import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BillersModel, objectModel } from '../../dashboards/dashboard.model';
import { MerchantModel } from '../../products/products.model';
import { Subject, takeUntil } from 'rxjs';
import { Favorite } from '../../../core/services/merchant/model';
import { MerchantService } from '../../../core/services';
// import { MerchantService } from '../../../core/services/merchant/merchant.service';
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-merchant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-card.component.html',
  styleUrl: './merchant-card.component.scss',
})
export class MerchantCardComponent {
  @Input() merchant!: BillersModel;
  @Input() get_merchant!: boolean;
  @Input() get_product = [];
  @Input() merchants!: MerchantModel;
  @Output() first6Output = new EventEmitter<BillersModel[]>();
  first6!: BillersModel[];
  favorite_merchant_making!: BillersModel | null;
  favorite_making!: boolean;
  favoriteMerchants!: BillersModel[];
  favoriteMerchantsNumber!: number;
  favoriteMerchantLoading!: boolean;
  merchantsDetail!: BillersModel[];
  @Output() merchantInfoOutput = new EventEmitter<BillersModel[]>();
  last4!: BillersModel[];
  start = 0;
  end = 4;

  merchantInfo!: BillersModel[];

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private merchantService: MerchantService) {}

  // ngOnInit(): void {
  //     // this.getFavoriteMerchants('');
  //     // this.getMerchants('');
  // }
  // nextMerchant() {
  //   if (this.end < this.merchantInfo.length) {
  //     this.start++;
  //     this.end++;
  //     this.first6 = this.merchantInfo.slice(this.start, this.end);
  //   }
  // }
  // previousMerchant() {
  //   if (this.start > 0) {
  //     this.start--;
  //     this.end--;
  //     this.first6 = this.merchantInfo.slice(this.start, this.end);
  //   }
  // }

  // getMerchants(search: string) {
  //     this.merchantService
  //       .getMerchantsAutocomplete(search)
  //       .pipe(takeUntil(this.onDestroy$))
  //       .subscribe({
  //         next: data => {
  //           const response = data as objectsModel;
  //           // const merchantInfos: BillersModel[] = response.objects;
  //           this.merchantInfo = response.objects;
  //           // this.merchantInfoOutput.emit(merchantInfos);

  //           this.last4 = this.merchantInfo.slice(-4);
  //           const navigationBtn = document.getElementById(
  //             'navigationButtonMerchant'
  //           );
  //           // const first6s: BillersModel[] = merchantInfos.slice(this.start, this.end)
  //           this.first6 = this.merchantInfo.slice(this.start, this.end);
  //           console.log('======================================> first6',this.first6);
  //           // this.first6Output.emit(first6s)

  //           navigationBtn?.addEventListener('click', () => {
  //             this.nextMerchant();
  //             this.previousMerchant();
  //           });
  //           this.favorite_merchant_making = null;
  //         },
  //       });
  //   }

  // getFavoriteMerchants(search: string, activeLoading = true) {
  //   // activeLoading ? (this.favoriteMerchantLoading = true) : false;
  //   console.log(activeLoading);
  //   this.merchantService
  //     .getFavoriteMerchantsAutocomplete(search)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: response => {
  //         const data = response as objectsModel;
  //         this.favoriteMerchants = data.objects;
  //         this.favoriteMerchantsNumber = data.objects.length;
  //         this.favoriteMerchantLoading = false;
  //         this.favorite_merchant_making = null;
  //       },
  //       error: err => {
  //         this.favoriteMerchantLoading = false;
  //         console.log(err);
  //       },
  //     });
  // }

  makeFavoriteMerchants(favorite: BillersModel, event: Event) {
    event.stopPropagation();
    // const productCard: HTMLElement =
    //     event.target?.parentElement.parentElement.parentElement.parentElement
    //         .parentElement;
    // remove data-bs for bootstrap modal
    // productCard.removeAttribute('data-bs-target');
    // productCard.removeAttribute('data-bs-toggle');
    this.favorite_merchant_making = favorite;
    this.favorite_making = false;
    let body!: Favorite;
    if (!favorite.is_favorite_merchant) {
      body = {
        merchant: favorite.id,
        merchant_action: 'make_favorite',
      };
    } else if (favorite.is_favorite_merchant) {
      body = {
        merchant: favorite.id,
        merchant_action: 'revoke_favorite',
      };
    }

    // add data-bs after click on favorite star
    // productCard.setAttribute('data-bs-target', '#myModal');
    // productCard.setAttribute('data-bs-toggle', 'modal');
    this.merchantService
      .makeFavoriteMerchants(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const data = result as objectModel;
          const response = data.object;
          if (response.success) {
            // this.getMerchants('');
            // this.getFavoriteMerchants('');
          }
        },
      });
    console.log(
      '====================================> merchant',
      this.merchant
    );
  }
  closeModal() {
    const modal = document.getElementById('modal');
    if (modal !== null) {
      modal.style.display = 'none';
    }
  }
}
