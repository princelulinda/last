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
  //   this.getBiller();
  // }

  getMerchantProducts() {
    this.newsFeedService.getClientProducts().subscribe({
      next: res => {
        const prodResponse = res as { objects: MerchantModel[] };
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
    this.newsFeedService.getBillers().subscribe({
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
