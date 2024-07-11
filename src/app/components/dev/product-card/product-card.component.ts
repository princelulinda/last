import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product = '';
  @Input() merchant = '';
  @Input() get_merchant = [];
  @Input() get_product = [];
  // @Output() payMerchant = new EventEmitter<any>();

  // theme$: Observable<any>;
  // theme: any;

  constructor(/**private store: Store */) {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  }

  // ngOnInit(): void {
  //     this.theme$.subscribe({
  //         next: (theme) => {
  //             this.theme = theme;
  //         },
  //     });
  // }
  /**  was already commented */
  // openmodal(data: any) {
  //     this.payMerchant.emit(data);
  //     console.log('ZXCVBN',this.payMerchant);
  // }
  closeModal() {
    const modal = document.getElementById('modal');
    if (modal !== null) {
      modal.style.display = 'none';
    }
  }
}
