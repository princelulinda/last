import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/skeleton/skeleton.component';
import { BillersModel } from '../dashboard.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
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
