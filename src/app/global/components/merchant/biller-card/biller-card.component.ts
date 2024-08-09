import { Component, Input } from '@angular/core';
import { BillersModel } from '../../../../components/dashboards/dashboard.model';

@Component({
  selector: 'app-biller-card',
  standalone: true,
  imports: [],
  templateUrl: './biller-card.component.html',
  styleUrl: './biller-card.component.scss',
})
export class BillerCardComponent {
  @Input() recentBillers!: BillersModel[];
  @Input() categorySelected!: null;
  @Input() clearData!: boolean;

  biller: [] | null = null;

  openModal(merchant: BillersModel, event: Event) {
    // this.payMerchant = merchant;
    console.log(merchant);
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
