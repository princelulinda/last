import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { MerchantService } from '../../../../core/services';
import { MerchantPaymentComponent } from '../../../dev/merchant-payment/merchant-payment.component';
import { MerchantAutocompleteModel } from '../../merchant.models';
import { VariableService } from '../../../../core/services/variable/variable.service';

@Component({
  selector: 'app-merchant-card',
  standalone: true,
  imports: [CommonModule, MerchantPaymentComponent],
  templateUrl: './merchant-card.component.html',
  styleUrl: './merchant-card.component.scss',
})
export class MerchantCardComponent implements OnDestroy {
  @Input({ required: true }) merchant: MerchantAutocompleteModel = {
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
  @Input() type: 'column' | 'row' = 'column';
  @Input() action: 'merchant-payment' | 'output' = 'merchant-payment';
  @Input() disabledFavoriteAction = false;
  @Output() selectedMerchantEvent =
    new EventEmitter<MerchantAutocompleteModel>();

  isLoading = false;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private merchantService: MerchantService,
    private variableService: VariableService
  ) {}

  makeFavoriteMerchants(favorite: MerchantAutocompleteModel, event: Event) {
    this.isLoading = true;
    event.stopPropagation();
    let body!: { merchant: string; merchant_action: string };
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
    this.merchantService
      .makeFavoriteMerchants(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const data = result as {
            object: {
              response_data: MerchantAutocompleteModel;
              success: boolean;
              response_message: string;
              response_code: string;
            };
          };
          const response = data.object;
          if (response.success) {
            if (!favorite.is_favorite_merchant) {
              this.merchant.is_favorite_merchant = true;
              this.variableService.refreshFavoriteMerchants.set(true);
            } else {
              this.merchant.is_favorite_merchant = false;
              this.variableService.refreshFavoriteMerchants.set(true);
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  selectMerchant() {
    if (this.action === 'merchant-payment') {
      console.log('DISPACTH MERCHANT PAYMENT');
    } else if (this.action === 'output') {
      this.selectedMerchantEvent.emit(this.merchant);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
