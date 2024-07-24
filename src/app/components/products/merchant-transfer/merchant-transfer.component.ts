import { Component } from '@angular/core';
import { TransferComponent } from '../../transfer/transfer/transfer.component';

@Component({
  selector: 'app-merchant-transfer',
  standalone: true,
  imports: [TransferComponent],
  templateUrl: './merchant-transfer.component.html',
  styleUrl: './merchant-transfer.component.scss',
})
export class MerchantTransferComponent {}
