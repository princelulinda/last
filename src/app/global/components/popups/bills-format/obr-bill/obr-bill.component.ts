import { Component, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObrBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';

@Component({
  selector: 'app-obr-bill',
  standalone: true,
  imports: [CommonModule],
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

  ngAfterViewInit() {
    this.dialogElement = document.getElementById(
      'obr-bill'
    ) as HTMLDialogElement;
  }
}
