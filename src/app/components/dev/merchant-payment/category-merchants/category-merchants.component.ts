import { Component, Input, OnInit } from '@angular/core';
import { MerchantCardComponent } from '../../../merchant/global/merchant-card/merchant-card.component';
import { MerchantAutocompleteModel } from '../../../merchant/merchant.models';
import { MerchantService } from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-category-merchants',
  standalone: true,
  imports: [
    MerchantCardComponent,
    CommonModule,
    SkeletonComponent,
    EmptyStateComponent,
  ],
  templateUrl: './category-merchants.component.html',
  styleUrl: './category-merchants.component.scss',
})
export class CategoryMerchantsComponent implements OnInit {
  @Input({ required: true }) categoryId!: number;

  merchants: MerchantAutocompleteModel[] = [];
  isLoading = true;

  constructor(private merchantService: MerchantService) {}

  ngOnInit() {
    this.getCategoryMerchants();
  }

  getCategoryMerchants() {
    this.isLoading = true;
    this.merchantService.getCategoryMerchants(this.categoryId).subscribe({
      next: merchants => {
        this.merchants = merchants.objects;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
