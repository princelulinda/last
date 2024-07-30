import { AfterViewInit, Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandscpeBillModel } from '../../../../../core/services/dialog/dialogs-models';
import { DialogService } from '../../../../../core/services';

@Component({
  selector: 'app-landscape-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landscape-bill.component.html',
  styleUrls: ['./landscape-bill.component.scss'],
})
export class LandscapeBillComponent implements AfterViewInit {
  // @Input({ required: true })
  // successMessage: LandscpeBillModel = {
  //   logo_url: '',
  //   printable_text: '',
  //   receipt_date: new Date(),
  // };
  billContent!: HTMLElement;

  landscapeBillDialog: { active: boolean; payload: LandscpeBillModel | null } =
    {
      active: false,
      payload: null,
    };
  private dialogElement!: HTMLDialogElement | null;

  constructor(private dialogService: DialogService) {
    effect(() => {
      this.landscapeBillDialog = this.dialogService.landscapeBill();

      if (this.landscapeBillDialog.active && this.landscapeBillDialog.payload) {
        if (this.dialogElement) {
          this.dialogElement.showModal();
        }
      } else if (!this.landscapeBillDialog.active) {
        this.dialogElement?.close();
      }
    });
  }

  closeBillDialog() {
    this.dialogService.closeBillDialog();
  }

  ngAfterViewInit() {
    this.billContent = document.getElementById('bill-content') as HTMLElement;

    if (
      this.landscapeBillDialog.active &&
      this.landscapeBillDialog.payload?.printable_text
    ) {
      this.billContent.innerHTML =
        this.landscapeBillDialog.payload.printable_text;
    }
    this.dialogElement = document.getElementById(
      'landscape-bill'
    ) as HTMLDialogElement;
  }
}
