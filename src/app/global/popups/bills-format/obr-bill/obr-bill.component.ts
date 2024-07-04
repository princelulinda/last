import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObrBillModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-obr-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './obr-bill.component.html',
  styleUrls: ['./obr-bill.component.scss'],
})
export class ObrBillComponent {
  @Input() successMessage: ObrBillModel = {
    agence: '',
    amount: '',
    company: '',
    declarant_code: '',
    declarant_name: '',
    deliver_to: '',
    name: '',
    nif: '',
    office: '',
    receipt_date: '',
    receipt_num: '',
    ref: '',
    type: '',
  };
}
