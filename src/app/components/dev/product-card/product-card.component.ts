import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../products/products.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: ProductModel;
  @Input() merchant = '';
  @Input() get_merchant!: boolean;
  @Input() get_product!: boolean;
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
