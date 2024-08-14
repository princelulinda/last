import { Component, Input, OnInit } from '@angular/core';
import { Merchant_AutocompleteModel } from '../../merchant/global/merchant-card/merchant.model';
import { ProductListComponent } from './product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-merchant-payment',
  standalone: true,
  imports: [ProductListComponent, CommonModule],
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

    console.log(
      '###############################################################',
      this.merchant
    );
  }
}
