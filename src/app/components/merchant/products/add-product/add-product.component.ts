import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  addProductByMerchantDataModel,
  inputAmountModel,
} from '../products.model';
import { AmountFieldComponent } from '../../../../global/components/custom-field/amount-field/amount-field.component';
import { DialogService, MerchantService } from '../../../../core/services';

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
  @Input() MerchantId!: string;

  productForm: FormGroup;
  productPrice!: number | null;
  productImage: [] = [];
  productAdded = false;

  constructor(
    private merchantService: MerchantService,
    private fb: FormBuilder,
    // private store: Store,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    // comment
    this.merchantService.connectedMerchantId$.subscribe(
      (merchantId: string) => {
        this.MerchantId = merchantId;

        if (!merchantId) {
          this.router.navigate(['/m/mymarket/product-config']);
        }
      }
    );
  }
  inputAmount(amount: inputAmountModel) {
    this.productPrice = amount.amount;
  }
  addProduct() {
    this.dialogService.dispatchLoading();
    const product = {
      name: this.productForm.value.name,
      merchant: this.MerchantId,
      price: this.productPrice,
      short_description: this.productForm.value.description,
      accepts_cart: false,
      is_stockable: false,
    };

    this.productForm.disable();
    this.productAdded = true;
    this.merchantService
      .addProductByMerchant(product)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const data = result as addProductByMerchantDataModel;
          this.productForm.enable();
          this.productAdded = false;
          this.dialogService.closeLoading();
          if (data.object.success === false) {
            this.dialogService.openToast({
              title: 'failed',
              type: 'failed',
              message: "Le produit n'a pas été ajouté",
            });
          } else {
            this.dialogService.openToast({
              title: 'success',
              type: 'success',
              message: 'Product successfully added',
            });

            this.productForm.reset();
            this.productPrice = null;
            this.router.navigate(['/m/mymarket/product-config']);
          }
        },
        error: () => {
          this.productForm.enable();
          this.productAdded = false;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed',
            title: 'Échec',
            message: "Le produit n'a pas été ajouté, veuillez réessayer.",
          });
        },
      });
  }
}
