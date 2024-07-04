import { AfterViewInit, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantBillModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-merchant-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-bill.component.html',
  styleUrls: ['./merchant-bill.component.scss'],
})
export class MerchantBillComponent implements AfterViewInit {
  @Input() successMessage: MerchantBillModel = {
    adress: '',
    amount: '',
    code: '',
    credit_account: '',
    date: '',
    debit_account: '',
    description: '',
    merchantName: '',
    name: '',
    printable_text: '',
  };

  cardContent!: HTMLElement;

  ngAfterViewInit() {
    this.cardContent = document.getElementById('printable_text') as HTMLElement;

    if (this.successMessage.printable_text) {
      this.cardContent.innerHTML = this.successMessage.printable_text;
    }
  }
}
