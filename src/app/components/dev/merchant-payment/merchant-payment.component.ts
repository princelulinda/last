import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { MerchantProductsComponent } from './merchant-products/merchant-products.component';
import { Merchant_AutocompleteModel } from '../../merchant/merchant.models';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [MerchantProductsComponent, CommonModule],
  templateUrl: './merchant-payment.component.html',
  styleUrl: './merchant-payment.component.scss',
})
export class MerchantPaymentComponent implements OnInit {
  @Input({ required: true }) type:
    | 'merchant'
    | 'product'
    | 'biller'
    | 'category-produict'
    | 'category-merchant' = 'merchant';
  @Input() merchant!: Merchant_AutocompleteModel;
  theme$!: Observable<ModeModel>;
  theme!: ModeModel;
  selectedSection = 'first';
  constructor(private configService: ConfigService) {
    this.theme$ = this.configService.getMode();
  }
  ngOnInit() {
    this.theme$.subscribe(mode => (this.theme = mode));
  }
}
