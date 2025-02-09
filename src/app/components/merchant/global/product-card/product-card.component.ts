import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, takeUntil, Subject } from 'rxjs';

import { ModeModel } from '../../../../core/services/config/main-config.models';
import {
  ConfigService,
  DialogService,
  MerchantService,
} from '../../../../core/services';
import {
  FavoriteProductModel,
  ProductAutocompleteModel,
} from '../../products/products.model';
import { VariableService } from '../../../../core/services/variable/variable.service';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, AmountVisibilityComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product: ProductAutocompleteModel = {
    id: 0,
    lookup_description: '',
    lookup_icon: '',
    lookup_image: '',
    lookup_subtitle: '',
    lookup_title: '',
    price: 0,
    is_favorite_product: false,
  };
  @Input() type: 'row' | 'column' = 'column';
  @Input() action: 'merchant-payment' | 'output' = 'merchant-payment';
  @Input() disabledFavoriteAction = false;
  @Output() selectedProductEvent = new EventEmitter<ProductAutocompleteModel>();

  currentMode$: Observable<ModeModel>;
  currentMode!: ModeModel;
  isLoading!: boolean;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private merchantService: MerchantService,
    private variableService: VariableService,
    private dialogService: DialogService
  ) {
    this.currentMode$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.currentMode$.subscribe({
      next: theme => {
        this.currentMode = theme;
      },
    });
  }

  makeFavoriteProducts(favorite: ProductAutocompleteModel, event: Event) {
    this.isLoading = true;
    event.stopPropagation();
    let body!: { product: string; product_action: string };
    if (!favorite.is_favorite_product) {
      body = {
        product: favorite.id.toString(),
        product_action: 'make_favorite',
      };
    } else if (favorite.is_favorite_product) {
      body = {
        product: favorite.id.toString(),
        product_action: 'revoke_favorite',
      };
    }
    this.merchantService
      .makeFavoriteProduct(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const data = result as FavoriteProductModel;
          const response = data.object;
          if (response.success) {
            if (!favorite.is_favorite_product) {
              this.product.is_favorite_product = true;
              this.variableService.REFRESH_FAVORITE_PRODUCTS.set(true);
            } else {
              this.product.is_favorite_product = false;
              this.variableService.REFRESH_FAVORITE_PRODUCTS.set(true);
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  selectProduct() {
    if (this.action === 'merchant-payment') {
      this.dialogService.openMerchantPaymentDialog({
        type: 'product',
        product: this.product,
      });
    } else if (this.action === 'output') {
      this.selectedProductEvent.emit(this.product);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
