import { Component, Input, OnDestroy } from '@angular/core';
import { BillersAutocompleteModel } from '../../merchant.models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-biller-card',
  standalone: true,
  imports: [],
  templateUrl: './biller-card.component.html',
  styleUrl: './biller-card.component.scss',
})
export class BillerCardComponent implements OnDestroy {
  @Input({ required: true }) biller: BillersAutocompleteModel = {
    accepts_simple_payment: false,
    id: '0',
    is_favorite_merchant: false,
    icon: '',
    lookup_icon: '',
    lookup_image: '',
    lookup_subtitle: '',
    lookup_title: '',
    success: '',
    merchant_category_name: '',
  };
  @Input() categorySelected!: null;
  @Input() clearData!: boolean;
  @Input() disabledFavoriteAction = false;

  // biller: [] | null = null;
  private onDestroy$: Subject<void> = new Subject<void>();

  // openModal(merchant: BillersAutocompleteModel, event: Event) {
  //   // this.payMerchant = merchant;
  //   console.log(merchant);
  //   // this.biller = null;
  //   this.categorySelected = null;
  //   // this.merchantId = this.payMerchant.id;
  //   this.clearData = true;

  //   event.stopPropagation();
  //   // add data-bs after click on favorite star
  //   const element = event.target as HTMLButtonElement;
  //   element.setAttribute('data-bs-toggle', 'modal');
  //   element.setAttribute('data-bs-target', '#merchantModal');
  //   element.click();
  //   // accepts_simple_payment;
  //   // this.getMerchantDetails();
  // }

  // makeFavoriteMerchants(favorite: MerchantAutocompleteModel, event: Event) {
  //   this.isLoading = true;
  //   event.stopPropagation();
  //   let body!: Favorite;
  //   if (!favorite.is_favorite_merchant) {
  //     body = {
  //       merchant: favorite.id.toString(),
  //       merchant_action: 'make_favorite',
  //     };
  //   } else if (favorite.is_favorite_merchant) {
  //     body = {
  //       merchant: favorite.id.toString(),
  //       merchant_action: 'revoke_favorite',
  //     };
  //   }
  //   this.merchantService
  //     .makeFavoriteMerchants(body)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: result => {
  //         const data = result as objectModel;
  //         const response = data.object;
  //         if (response.success) {
  //           if (!favorite.is_favorite_merchant) {
  //             this.merchant.is_favorite_merchant = true;
  //             // this.variableService.isFavorite.next(true);
  //             this.variableService.refreshFavoriteMerchants.set(true);
  //           } else {
  //             this.merchant.is_favorite_merchant = false;
  //             // this.variableService.isFavorite.next(true);
  //             this.variableService.refreshFavoriteMerchants.set(true);
  //           }
  //         }
  //         this.isLoading = false;
  //       },
  //       error: () => {
  //         this.isLoading = false;
  //       },
  //     });
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
