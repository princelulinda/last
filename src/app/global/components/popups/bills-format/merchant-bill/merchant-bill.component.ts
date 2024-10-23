import { AfterViewInit, Component, effect, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchantBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-merchant-bill',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './merchant-bill.component.html',
  styleUrls: ['./merchant-bill.component.scss'],
})
export class MerchantBillComponent implements AfterViewInit {
  merchantBillDialog: {
    active: boolean;
    payload: MerchantBillModel | null;
  } = {
    active: false,
    payload: null,
  };
  @Input() merchantBill!: MerchantBillModel | null;
  private dialogElement!: HTMLDialogElement | null;
  cardContent!: HTMLElement;

  constructor(private dialogService: DialogService) {
    effect(() => {
      this.merchantBillDialog = this.dialogService.merchantBill();

      if (this.merchantBillDialog.active && this.merchantBillDialog.payload) {
        if (this.dialogElement) {
          this.dialogElement.showModal();
        }
      } else if (!this.merchantBillDialog.active) {
        this.dialogElement?.close();
      }
    });
  }

  closeBillDialog() {
    this.dialogService.closeBillDialog();
  }

  ngAfterViewInit() {
    this.cardContent = document.getElementById('printable_text') as HTMLElement;
    this.dialogElement = document.getElementById(
      'merchant-bill'
    ) as HTMLDialogElement;

    if (this.merchantBillDialog.active && this.merchantBillDialog.payload) {
      if (this.merchantBillDialog.payload.printable_text) {
        this.cardContent.innerHTML =
          this.merchantBillDialog.payload.printable_text;
      }
    }
    if (this.merchantBill && this.merchantBill.printable_text) {
      this.cardContent.innerHTML = this.merchantBill.printable_text;
    }
  }
}
