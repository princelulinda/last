import { Component, OnInit } from '@angular/core';
import { ListComponent } from '../../../../../global/components/list/list/list.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreditRequestComponent } from '../credit-request/credit-request.component';

@Component({
  selector: 'app-credit-request-list',
  standalone: true,
  imports: [ListComponent, CommonModule, CreditRequestComponent],
  templateUrl: './credit-request-list.component.html',
  styleUrl: './credit-request-list.component.scss',
})
export class CreditRequestListComponent implements OnInit {
  headers = [
    {
      name: 'Holder',
      field: ['main_account.acc_holder', 'main_account.acc_number'],
      size: '',
      detail: {
        link: '/w/workstation/d/desk/credit/request/',
        field: 'id',
      },
    },
    {
      name: 'Date',
      field: ['created_at'],
      size: '',
      format: 'date',
    },

    {
      name: 'Credit Amount',
      field: ['amount'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Fees',
      field: ['fees_amount'],
      size: '',
    },
    {
      name: 'Payment Number',
      field: ['payment_number'],
      size: '',
    },
    {
      name: 'Period',
      field: ['period'],
      size: '',
    },
    {
      name: 'Status',
      field: ['status.title'],
      size: '',
      css: 'status.css',
      class: 'badge',
    },
  ];

  request = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route && this.route.fragment) {
      this.route.fragment.subscribe(fragment => {
        this.request = fragment === 'new';
        console.log('fragment', this.request);
      });
    }
  }
}
