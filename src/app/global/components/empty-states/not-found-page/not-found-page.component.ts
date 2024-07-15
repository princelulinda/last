import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  @Input() action = 'Return';

  // constructor() {}

  // goBack() {
  //   if (this.action === 'Return') {
  //     // this._location.back();
  //   } else if (this.action === 'Close') {
  //     this.closePage();
  //   }
  // }

  // closePage() {
  //   this.close.emit(false);
  // }
}
