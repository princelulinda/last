import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/skeleton/skeleton.component';
import { BillersModel } from '../dashboard.model';
import { ConfigService } from '../../../core/services';
import { Router } from '@angular/router';

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

  billers: BillersModel[] | [] | null = null;
  billersLoading = true;

  selectedBiller: BillersModel | null = null;

  loadingProducts = true;

  constructor(
    private configService: ConfigService,
    private router: Router
  ) {}

  selectBiller(biller: BillersModel) {
    this.selectedBiller = biller;
  }

  // switchPlateform(plateform: PlateformModel, url?: string) {
  //   this.configService.switchPlateform(plateform);

  //   if (url) {
  //     this.router.navigate([url]);
  //   }
  // }
}
