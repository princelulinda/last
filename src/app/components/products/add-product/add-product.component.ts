import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MarketService } from '../../../core/services/market/market.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  addProductByMerchantDataModel,
  inputAmountModel,
  MerchantModel,
} from '../products.model';
import { AmountFieldComponent } from '../../../global/components/custom-field/amount-field/amount-field.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AmountFieldComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input() merchant!: MerchantModel;

  productForm: FormGroup;
  productPrice!: number | null;
  productImage: [] = [];
  productAdded = false;

  constructor(
    private marketService: MarketService,
    private fb: FormBuilder,
    // private store: Store,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    // comment
    this.marketService.connectedMerchantId$.subscribe((merchantId: string) => {
      this.merchant.id = merchantId;
      if (!merchantId) {
        this.router.navigate(['/m/mymarket/product-config']);
      }
    });
  }
  inputAmount(amount: inputAmountModel) {
    this.productPrice = amount.amount;
  }
  addProduct() {
    const product = {
      name: this.productForm.value.name,
      merchant: this.merchant,
      price: this.productPrice,
      short_description: this.productForm.value.description,
      accepts_cart: false,
      is_stockable: false,
    };

    this.productForm.disable();
    this.productAdded = true;
    this.marketService
      .addProductByMerchant(product)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const data = result as addProductByMerchantDataModel;
          this.productForm.enable();
          this.productAdded = false;
          if (data.object.success === false) {
            const notification = {
              title: '',
              type: 'failed',
              message: data.object.response_message,
            };
            // this.store.dispatch(new OpenDialog(notification));
            console.log(notification);
          } else {
            const notification = {
              title: '',
              type: 'success',
              message: 'Product successfully added',
            };
            // this.store.dispatch(new OpenDialog(notification));
            console.log(notification);
            this.productForm.reset();
            this.productPrice = null;
            this.router.navigate(['/m/mymarket/product-config']);
          }
        },
        error: data => {
          this.productForm.enable();
          this.productAdded = false;
          let message;
          if (data.object) {
            message = data.object.response_message;
          } else {
            message = 'Error occurred';
          }
          const notification = {
            title: '',
            type: 'failed',
            message: message,
          };
          // this.store.dispatch(new OpenDialog(notification));
          console.log(notification);
        },
      });
  }
}
