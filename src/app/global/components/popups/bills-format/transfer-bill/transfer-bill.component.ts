import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfertBillModel } from '../../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-transfer-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transfer-bill.component.html',
  styleUrls: ['./transfer-bill.component.scss'],
})
export class TransferBillComponent {
  @Input() successMessage: TransfertBillModel = {
    amount: '',
    bank_reference: '',
    bill_date: '',
    credit_account: '',
    credit_account_holder: '',
    credit_bank: '',
    debit_account: '',
    debit_account_holder: '',
    debit_bank: '',
    description: '',
    reference: '',
    transfer_fees: '',
  };
}
