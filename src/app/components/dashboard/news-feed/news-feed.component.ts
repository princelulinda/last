import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/skeleton/skeleton.component';
import { BillersModel } from '../dashboard.model';

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

  // constructor() {}

  selectBiller(biller: BillersModel) {
    this.selectedBiller = biller;
  }
}
