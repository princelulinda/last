import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { objectModel } from '../../../dashboards/dashboard.model';
import { Favorite } from '../../../../core/services/merchant/model';
import { MerchantService } from '../../../../core/services';
import { Merchant_AutocompleteModel } from './merchant.model';
import { MerchantPaymentComponent } from '../../../dev/merchant-payment/merchant-payment.component';

@Component({
  selector: 'app-merchant-card',
  standalone: true,
  imports: [CommonModule, MerchantPaymentComponent],
  templateUrl: './merchant-card.component.html',
  styleUrl: './merchant-card.component.scss',
})
export class MerchantCardComponent {
  @Input({ required: true }) merchant: Merchant_AutocompleteModel = {
    accepts_simple_payment: false,
    id: 0,
    is_favorite_merchant: false,
    lookup_description: '',
    lookup_has_image_or_icon: false,
    lookup_icon: '',
    lookup_image: '',
    lookup_subtitle: '',
    lookup_title: '',
    merchant_category_name: '',
  };
  isLoading = false;
  payment = false;

  // @Input() get_merchant!: boolean
  // @Input() get_product = [];
  // @Input() merchants!: MerchantModel;
  // @Output() first6Output = new EventEmitter<BillersModel[]>();
  // first6!: BillersModel[];
  // @Input() favorite_merchant_making!: BillersModel | null;
  // favorite_making!: boolean;
  // favoriteMerchants!: BillersModel[];
  // favoriteMerchantsNumber!: number;
  // favoriteMerchantLoading!: boolean;
  // merchantsDetail!: BillersModel[];
  // @Output() merchantInfoOutput = new EventEmitter<string>();
  // last4!: BillersModel[];
  // start = 0;
  // end = 4;

  // merchantInfo!: BillersModel[];

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private merchantService: MerchantService) {}

  makeFavoriteMerchants(favorite: Merchant_AutocompleteModel, event: Event) {
    this.isLoading = true;
    event.stopPropagation();
    // const productCard: HTMLElement =
    //     event.target?.parentElement.parentElement.parentElement.parentElement
    //         .parentElement;
    // remove data-bs for bootstrap modal
    // productCard.removeAttribute('data-bs-target');
    // productCard.removeAttribute('data-bs-toggle');
    // this.favorite_merchant_making = favorite;
    // this.favorite_making = false;
    let body!: Favorite;
    if (!favorite.is_favorite_merchant) {
      body = {
        merchant: favorite.id.toString(),
        merchant_action: 'make_favorite',
      };
    } else if (favorite.is_favorite_merchant) {
      body = {
        merchant: favorite.id.toString(),
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
            if (!favorite.is_favorite_merchant) {
              this.merchant.is_favorite_merchant = true;
            } else {
              this.merchant.is_favorite_merchant = false;
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  togglePayment() {
    this.payment = true;
  }
}
