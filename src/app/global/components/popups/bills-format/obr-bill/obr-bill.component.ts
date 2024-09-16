import { Component, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObrBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-obr-bill',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  templateUrl: './obr-bill.component.html',
  styleUrls: ['./obr-bill.component.scss'],
})
export class ObrBillComponent implements AfterViewInit {
  // @Input() successMessage: ObrBillModel = {
  //   agence: '',
  //   amount: '',
  //   company: '',
  //   declarant_code: '',
  //   declarant_name: '',
  //   deliver_to: '',
  //   name: '',
  //   nif: '',
  //   office: '',
  //   receipt_date: '',
  //   receipt_num: '',
  //   ref: '',
  //   type: '',
  // };
  obrBillDialog: { active: boolean; payload: ObrBillModel | null } = {
    active: false,
    payload: null,
  };
  private dialogElement!: HTMLDialogElement | null;
  cardContent!: HTMLElement;

  constructor(private dialogService: DialogService) {
    effect(() => {
      this.obrBillDialog = this.dialogService.obrBill();

      if (this.obrBillDialog.active && this.obrBillDialog.payload) {
        if (this.dialogElement) {
          this.dialogElement.showModal();
        }
      } else if (!this.obrBillDialog.active) {
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
      'obr-bill'
    ) as HTMLDialogElement;

    if (this.obrBillDialog.active && this.obrBillDialog.payload) {
      if (this.obrBillDialog.payload.printable_text) {
        this.cardContent.innerHTML = this.obrBillDialog.payload.printable_text;
      }
    }
  }
}
