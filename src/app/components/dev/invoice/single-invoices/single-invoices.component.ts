import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MerchantService } from '../../../../core/services';
import { Subject, takeUntil } from 'rxjs';
import { SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
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
  singleInVoice: SingleInVoiceModel | null = null;
  merchantId!: string | number;
  pagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };
  response_data = 0;
  loader = true;
  activePage = 1;

  constructor(
    private route: ActivatedRoute,
    private merchantService: MerchantService
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.merchantId = params['id'];
      this.getSingleInvoices();
    });
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
          this.merchantId = (
            this.singleInVoice as SingleInVoiceModel
          ).merchant_teller.merchant.id;
        },
        error: () => {
          this.loader = false;
        },
      });
  }
  onPaginationChange(pagination: PaginationConfig) {
    this.pagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getSingleInvoices();
  }
}
