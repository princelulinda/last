import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BillersModel } from '../../dashboards/dashboard.model';
import { MerchantModel } from '../../products/products.model';
// import { MerchantService } from '../../../core/services/merchant/merchant.service';
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-merchant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-card.component.html',
  styleUrl: './merchant-card.component.scss',
})
export class MerchantCardComponent {
  @Input() merchant!: BillersModel;
  @Input() get_merchant!: boolean;
  @Input() get_product = [];
  @Input() merchants!: MerchantModel;

  // theme$: Observable<any>;
  // theme: any;

  // constructor(private store: Store) {
  //     this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  // }

  // ngOnInit(): void {
  //     this.theme$.subscribe({
  //         next: (theme) => {
  //             this.theme = theme;
  //         },
  //     });
  // }

  closeModal() {
    const modal = document.getElementById('modal');
    if (modal !== null) {
      modal.style.display = 'none';
    }
  }
}
