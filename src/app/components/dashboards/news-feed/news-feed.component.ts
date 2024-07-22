import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { BillersModel, ProductModel } from '../dashboard.model';
import { ConfigService } from '../../../core/services';
import { NewsFeedService } from '../../../core/services/newsFeed/news-feed.service';
import { ShowMoreDirective } from '../../../global/directives/show-more/show-more.directive';
import { PublicationsComponent } from '../../publications/publications.component';
import { PlateformModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [SkeletonComponent, ShowMoreDirective, PublicationsComponent],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.scss',
})
export class NewsFeedComponent implements OnDestroy, OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  countProductLoader = [1, 2, 3, 4];
  search = '';

  topProducts: ProductModel[] | [] | null = null;
  product: ProductModel | null = null;

  billers: BillersModel[] | [] | null = null;
  billersLoading = true;

  selectedBiller: BillersModel | null = null;

  loadingProducts = true;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private newsFeedService: NewsFeedService
  ) {}

  ngOnInit(): void {
    this.getMerchantProducts();
  }

  getMerchantProducts() {
    this.newsFeedService
      .getClientProducts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: res => {
          const prodResponse = res as { objects: ProductModel[] };
          this.topProducts = prodResponse.objects;
          this.loadingProducts = false;
          console.log('**********TOP******* PRODUCTS : ', this.topProducts);
        },
        error: err => {
          this.loadingProducts = false;
          console.error(err);
        },
      });
  }

  getBiller() {
    this.newsFeedService
      .getBillers()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: res => {
          const billersResponse = res as { objects: BillersModel[] };
          this.billers = billersResponse.objects;
          this.billersLoading = false;
          console.log('**********BILLERS******* : ', this.billers[0]);
        },
        error: err => {
          this.billersLoading = false;
          console.error(err);
        },
      });
  }

  selectBiller(biller: BillersModel) {
    this.selectedBiller = biller;
  }

  selectProduct(product: ProductModel) {
    this.product = product;
  }

  switchPlateform(plateform: PlateformModel, url?: string) {
    this.configService.switchPlateform(plateform);

    if (url) {
      this.router.navigate([url]);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
