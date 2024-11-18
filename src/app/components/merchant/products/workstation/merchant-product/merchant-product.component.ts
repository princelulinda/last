import { Component } from '@angular/core';

import { ListComponent } from '../../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './merchant-product.component.html',
  styleUrl: './merchant-product.component.scss',
})
export class MerchantProductComponent {
  headers = [
    {
      name: 'Product',
      field: ['name'],
      size: '',
    },
    {
      name: 'Merchant',
      field: ['merchant.merchant_title'],
      size: '',
    },
    { name: 'Slug', field: ['slug'], size: '' },
    { name: 'Active', field: ['is_active'], size: '', boolean: true },
    { name: 'Price', field: ['price'], size: '' },
  ];
}
