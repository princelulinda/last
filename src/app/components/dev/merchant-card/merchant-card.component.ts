import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { billerValue } from './merchant.model';
// import { billerValue } from './merchant.model';

@Component({
  selector: 'app-merchant-card',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './merchant-card.component.html',
  styleUrl: './merchant-card.component.scss',
})
export class MerchantCardComponent {
  // payMerchant: any;
  biller!: [] | null;
  categorySelected!: null;
  merchantId!: string;
  merchants!: billerValue[];
  first6!: [];
  clearData!: boolean;
  billers!: billerValue[];

  openModal(merchant: [], event: Event) {
    // this.payMerchant = merchant;
    this.biller = null;
    this.categorySelected = null;
    // this.merchantId = this.payMerchant.id;
    this.clearData = true;

    event.stopPropagation();
    // add data-bs after click on favorite star
    const element = event.target as HTMLButtonElement;
    element.setAttribute('data-bs-toggle', 'modal');
    element.setAttribute('data-bs-target', '#merchantModal');
    element.click();
    // accepts_simple_payment;
    // this.getMerchantDetails();
  }
}
