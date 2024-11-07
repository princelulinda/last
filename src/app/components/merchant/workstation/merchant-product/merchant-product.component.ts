import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-merchant-product',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './merchant-product.component.html',
  styleUrl: './merchant-product.component.scss',
})
export class MerchantProductComponent {
  selectedMenu = 'list';
  headers = [
    {
      name: 'Product',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/intranet/merchant/product/details/',
        field: 'id',
      },
    },
    {
      name: 'Merchant',
      field: ['merchant.merchant_title'],
      size: '',
      detail: {
        link: '/w/workstation/intranet/merchant/details/',
        field: 'id',
      },
    },
    // { name: 'Id', field: ['id'], size: '' },
    { name: 'Slug', field: ['slug'], size: '' },
    { name: 'Active', field: ['is_active'], size: '', boolean: true },
    { name: 'Price', field: ['price'], size: '' },
  ];
  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
}
