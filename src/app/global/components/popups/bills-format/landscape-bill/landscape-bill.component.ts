import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandscpeBillModel } from '../../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-landscape-bill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landscape-bill.component.html',
  styleUrls: ['./landscape-bill.component.scss'],
})
export class LandscapeBillComponent implements AfterViewInit {
  // @Input({ required: true })
  successMessage: LandscpeBillModel = {
    logo_url: '',
    printable_text: '',
    receipt_date: new Date(),
  };

  billContent!: HTMLElement;

  ngAfterViewInit() {
    this.billContent = document.getElementById('bill-content') as HTMLElement;

    if (this.successMessage.printable_text) {
      this.billContent.innerHTML = this.successMessage.printable_text;
    }
  }
}
