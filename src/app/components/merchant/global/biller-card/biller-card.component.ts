import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import { Subject } from 'rxjs';

import { BillersAutocompleteModel } from '../../merchant.models';
import { DialogService } from '../../../../core/services';

@Component({
  selector: 'app-biller-card',
  standalone: true,
  imports: [],
  templateUrl: './biller-card.component.html',
  styleUrl: './biller-card.component.scss',
})
export class BillerCardComponent implements OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) biller!: BillersAutocompleteModel;
  @Input() categorySelected!: null;
  @Input() clearData!: boolean;
  @Input() disabledFavoriteAction = false;
  @Input() action: 'merchant-payment' | 'output' = 'merchant-payment';

  @Output() selectedBillerEvent = new EventEmitter<BillersAutocompleteModel>();

  constructor(private dialogService: DialogService) {}

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

  selectBiller() {
    if (this.action === 'merchant-payment') {
      this.dialogService.openMerchantPaymentDialog({
        type: 'biller',
        biller: this.biller,
      });
    } else if (this.action === 'output') {
      this.selectedBillerEvent.emit(this.biller);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
