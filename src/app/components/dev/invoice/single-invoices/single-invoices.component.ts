import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-invoices',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './single-invoices.component.html',
  styleUrl: './single-invoices.component.scss',
})
export class SingleInvoicesComponent {
  // private onDestroy$: Subject<void> = new Subject<void>();
  // single_invoices: any;
  // constructor(
  //   private merchantService: MerchantService,
  //   private dialogService: DialogService
  // ) {}
  // ngOnInit(){
  //   this.getSingleInvoices();
  // }
  // getSingleInvoices() {
  //   this.single_invoices = null;
  //   this.merchantService.getSingleInvoices().pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: response => {
  //         console.log('the data of the single invoices', response);
  //       }
  //     })
  // }
}
