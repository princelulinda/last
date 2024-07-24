import { Component, Input } from '@angular/core';
import { BeneficiariesComponent } from '../beneficiaries/beneficiaries/beneficiaries.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  imports: [BeneficiariesComponent],
})
export class TransferComponent {
  @Input() isMerchantTransfer!: boolean;
  @Input() simpleTransferTitle!: boolean;
}
