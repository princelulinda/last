import { Component, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfertBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';

@Component({
  selector: 'app-transfer-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transfer-bill.component.html',
  styleUrls: ['./transfer-bill.component.scss'],
})
export class TransferBillComponent implements AfterViewInit {
  transferBillDialog: { active: boolean; payload: TransfertBillModel | null } =
    {
      active: false,
      payload: null,
    };
  private dialogElement!: HTMLDialogElement | null;

  constructor(private dialogService: DialogService) {
    effect(() => {
      this.transferBillDialog = this.dialogService.transferBill();

      if (this.transferBillDialog.active && this.transferBillDialog.payload) {
        if (this.dialogElement) {
          this.dialogElement.showModal();
        }
      } else if (!this.transferBillDialog.active) {
        this.dialogElement?.close();
      }
    });
  }

  // @Input() successMessage: TransfertBillModel = {
  //   amount: '',
  //   bank_reference: '',
  //   bill_date: '',
  //   credit_account: '',
  //   credit_account_holder: '',
  //   credit_bank: '',
  //   debit_account: '',
  //   debit_account_holder: '',
  //   debit_bank: '',
  //   description: '',
  //   reference: '',
  //   transfer_fees: '',
  // };

  ngAfterViewInit() {
    this.dialogElement = document.getElementById(
      'transfer-bill'
    ) as HTMLDialogElement;
  }
}
