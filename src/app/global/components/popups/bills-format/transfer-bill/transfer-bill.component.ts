import { Component, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfertBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-transfer-bill',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
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
  cardContent!: HTMLElement;

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

  closeBillDialog() {
    this.dialogService.closeBillDialog();
  }

  ngAfterViewInit() {
    this.cardContent = document.getElementById('printable_text') as HTMLElement;
    this.dialogElement = document.getElementById(
      'transfer-bill'
    ) as HTMLDialogElement;
    if (this.transferBillDialog.active && this.transferBillDialog.payload) {
      if (this.transferBillDialog.payload.printable_text) {
        this.cardContent.innerHTML =
          this.transferBillDialog.payload.printable_text;
      }
    }
  }
}
