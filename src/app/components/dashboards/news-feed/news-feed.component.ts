import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/skeleton/skeleton.component';
import { BillersModel, MerchantModel } from '../dashboard.model';
import { ConfigService } from '../../../core/services';
import { Router } from '@angular/router';
import { NewsFeedService } from '../../../core/services/newsFeed/news-feed.service';

@Component({
  selector: 'app-news-feed',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './news-feed.component.html',
  styleUrl: './news-feed.component.scss',
})
export class NewsFeedComponent {
  countProductLoader = [1, 2, 3, 4];
  search = '';

  topProducts: MerchantModel[] | [] | null = null;

  billers: BillersModel[] | [] | null = null;
  billersLoading = true;

  selectedBiller: BillersModel | null = null;

  loadingProducts = true;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private newsFeedService: NewsFeedService
  ) {}

  // ngOnInit(): void {
  //   this.getMerchantProducts();
  // }

  getMerchantProducts() {
    this.newsFeedService.getClientProducts().subscribe({
      next: res => {
        this.topProducts = res as MerchantModel[] | null;
        this.loadingProducts = false;
        console.log('**********TOP******* PRODUCTS : ', this.topProducts);
      },
    });
  }

  selectBiller(biller: BillersModel) {
    this.selectedBiller = biller;
  }

  openGooglePlayStore() {
    window.open(
      'https://play.google.com/store/apps/details?id=com.ubuviz.ihera_mobile&hl=fr&gl=US',
      '_blank'
    );
  }

  openAppStore() {
    window.open(
      'https://apps.apple.com/fr/app/ihel%C3%A1-ryanje-app/id6470385289',
      '_blank'
    );
  }

  // switchPlateform(plateform: PlateformModel, url?: string) {
  //   this.configService.switchPlateform(plateform);

  //   if (url) {
  //     this.router.navigate([url]);
  //   }
  // }
}
