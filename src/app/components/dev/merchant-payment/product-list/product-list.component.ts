import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MerchantService } from '../../../../core/services';
import { Subject, takeUntil } from 'rxjs';
import { ProductCardComponent } from '../../../merchant/global/product-card/product-card.component';
import { ProductModel } from '../../../dashboards/dashboard.model';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, SkeletonComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  @Input() merchantId = 0;
  products!: ProductModel[];
  isLoading = true;

  constructor(private merchantService: MerchantService) {}
  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit() {
    this.merchantService
      .getProductsByMerchant(this.merchantId.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: products => {
          const results = products as { objects: ProductModel[] };
          this.products = results.objects;
          this.isLoading = false;
          console.log(
            'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
            this.products
          );
        },
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
