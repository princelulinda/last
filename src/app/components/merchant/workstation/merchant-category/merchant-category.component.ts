import { Component } from '@angular/core';
import { ListComponent } from '../../../../global/components/list/list/list.component';

@Component({
  selector: 'app-merchant-category',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './merchant-category.component.html',
  styleUrl: './merchant-category.component.scss',
})
export class MerchantCategoryComponent {
  headers = [
    {
      name: 'Name',
      field: ['name'],
      size: '',
      detail: {
        link: '/w/workstation/intranet/merchant/category/details/',
        field: 'id',
      },
    },
    { name: 'Active', field: ['is_active'], size: '', boolean: true },
    { name: 'Slug', field: ['slug'], size: '' },
  ];
}
