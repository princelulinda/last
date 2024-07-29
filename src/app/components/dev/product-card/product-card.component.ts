import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../dashboards/dashboard.model';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services';
// import { ProductModel } from '../../products/products.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductModel;
  @Input() get_product!: boolean;
  currentMode$: Observable<ModeModel>;
  currentMode!: ModeModel;

  constructor(private configService: ConfigService) {
    this.currentMode$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.currentMode$.subscribe({
      next: theme => {
        this.currentMode = theme;
      },
    });
  }
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
