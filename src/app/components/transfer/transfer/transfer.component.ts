import { Component, Input } from '@angular/core';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
  imports: [NotFoundPageComponent],
})
export class TransferComponent {
  @Input() isMerchantTransfer!: boolean;
  @Input() simpleTransferTitle!: boolean;
}
