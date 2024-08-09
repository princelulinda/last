import { Component } from '@angular/core';
import { TransferComponent } from '../../transfer/transfer/transfer.component';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';

@Component({
  selector: 'app-merchant-transfer',
  standalone: true,
  imports: [TransferComponent, NotFoundPageComponent],
  templateUrl: './merchant-transfer.component.html',
  styleUrl: './merchant-transfer.component.scss',
})
export class MerchantTransferComponent {}
