import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
// import { Subject } from 'rxjs';
// import { MerchantService } from '../../../core/services/merchant/merchant.service';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss',
})
export class MerchantsComponent {
  // private onDestroy$: Subject<void> = new Subject<void>();

  searchInput = new FormControl('');
  // theme: any;
  // theme$: Observable<any>;
  // merchants: any;
  // merchant: any;
  merchants!: [];
  favorite_merchant_making = null;

  isLoading = false;
  constructor() // private merchantService: MerchantService,
  // private store: Store
  {
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchInput.value;
    return typeof searchValue === 'string' && searchValue.trim() !== '';
  }
  searchFor() {
    // this.merchants = null;

    if (this.searchInput.value) {
      const searchTerm = this.searchInput.value.trim();

      if (searchTerm) {
        // this.variableService.search.next(searchTerm);
      }
    } else {
      // this.merchant = null;
      // this.searchInput.setValue('')
      // this.variableService.search.next('');
    }
  }
  /**   can work if added interface and is needed in market-dashboard
   *
   */
  // getMerchants(search: string) {
  //   this.isLoading = true;

  //   this.merchantService
  //       .getMerchantsAutocomplete(search)
  //       .pipe(takeUntil(this.onDestroy$))
  //       .subscribe({
  //           next: (data: any) => {
  //               this.isLoading = false;
  //               this.merchants = data.objects;

  //               this.favorite_merchant_making = null;
  //           },
  //           error: (err) => {
  //               this.isLoading = false;
  //               console.log(err)

  //               const data = {
  //                   title: '',
  //                   type: 'failed',
  //                   message: 'Something went wrong, please try again',
  //               };
  //               console.log(data)
  //               // this.store.dispatch(new OpenDialog(data));
  //           },
  //       });
  // }
}
