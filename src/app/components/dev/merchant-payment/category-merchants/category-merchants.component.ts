import { Component, Input } from '@angular/core';
import { MerchantCardComponent } from '../../../merchant/global/merchant-card/merchant-card.component';
import { Merchant_AutocompleteModel } from '../../../merchant/merchant.models';

@Component({
  selector: 'app-category-merchants',
  standalone: true,
  imports: [MerchantCardComponent],
  templateUrl: './category-merchants.component.html',
  styleUrl: './category-merchants.component.scss',
})
export class CategoryMerchantsComponent {
  @Input({ required: true }) categoryId!: number;

  merchants: Merchant_AutocompleteModel[] = [];
  isLoading = true;
}
