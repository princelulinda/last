import { Component, Input } from '@angular/core';
import { SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-invoices-by-group',
  standalone: true,
  imports: [AmountVisibilityComponent],
  templateUrl: './invoices-by-group.component.html',
  styleUrl: './invoices-by-group.component.scss',
})
export class InvoicesByGroupComponent {
  @Input({ required: true }) invoices!: SingleInVoiceModel;
}
