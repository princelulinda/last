import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, takeUntil, Subject } from 'rxjs';

import { ProductModel } from '../../../dashboards/dashboard.model';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { ConfigService, MerchantService } from '../../../../core/services';
import {
  FavoriteModel,
  ProductFavoriteModel,
} from '../../products/products.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product: ProductModel = {
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

  currentMode$: Observable<ModeModel>;
  currentMode!: ModeModel;
  isLoading!: boolean;
  // @Input() isFavorite!: boolean;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private merchantService: MerchantService
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

  makeFavoriteProducts(favorite: ProductModel, event: Event) {
    this.isLoading = true;
    event.stopPropagation();
    let body!: ProductFavoriteModel;
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
          const data = result as FavoriteModel;
          const response = data.object;
          if (response.success) {
            if (!favorite.is_favorite_product) {
              this.product.is_favorite_product = true;
            } else {
              this.product.is_favorite_product = false;
            }
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
