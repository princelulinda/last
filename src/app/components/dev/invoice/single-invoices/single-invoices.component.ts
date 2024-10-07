import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MerchantService } from '../../../../core/services';
import { Subject, takeUntil } from 'rxjs';
import { SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { MerchantAutocompleteModel } from '../../../merchant/merchant.models';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';

@Component({
  selector: 'app-single-invoices',
  standalone: true,
  imports: [RouterLink, AmountVisibilityComponent, PaginationComponent],
  templateUrl: './single-invoices.component.html',
  styleUrl: './single-invoices.component.scss',
})
export class SingleInvoicesComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  singleInvoices!: SingleInVoiceModel[] | null;
  merchant!: MerchantAutocompleteModel;
  merchantId!: number;
  pagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };
  response_data = 0;
  loader = true;
  activePage = 1;

  constructor(private merchantService: MerchantService) {}
  ngOnInit() {
    this.getSingleInvoices();
  }
  getSingleInvoices() {
    this.loader = true;
    this.singleInvoices = null;
    this.merchantService
      .getSingleInvoices(this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: response => {
          this.loader = false;
          this.singleInvoices = response.objects;
          this.response_data = response.count;
          // this.merchantId = this.merchant.id;
        },
      });
  }
  onPaginationChange(paginationConfig: PaginationConfig) {
    this.pagination = paginationConfig;
    this.activePage =
      paginationConfig.filters.offset / paginationConfig.filters.limit + 1;
    this.getSingleInvoices();
  }
}
