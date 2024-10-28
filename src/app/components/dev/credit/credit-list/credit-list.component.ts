import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CreditService } from '../../../../core/services/credit/credit.service';
import { ListComponent } from '../../../../global/components/list/list/list.component';
import { CreditListModel } from '../../../loan/loan.models';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [ListComponent, RouterLink],
  templateUrl: './credit-list.component.html',
  styleUrl: './credit-list.component.scss',
})
export class CreditListComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  headers = [
    {
      name: 'Client',
      field: ['cred_holder'],
      size: '',
      format: '',
      detail: {
        link: '/w/workstation/desk/credit/details/',
        field: 'id',
      },
    },
    {
      name: 'Date',
      field: ['cred_first_date'],
      size: '',
      format: 'date',
    },

    {
      name: 'Loan id',
      field: ['cred_code'],
      size: '',
      format: '',
    },
    {
      name: 'Type',
      field: ['cred_branch_defaults.loan_type.title'],
      size: '',
    },
    {
      name: 'Credit Amount',
      field: ['cred_amount'],
      size: '',
      format: 'currency',
    },

    {
      name: 'Credit status',
      field: ['cred_status.title'],
      size: '',
      format: '',
      css: 'cred_status.css',
      class: 'badge',
    },
  ];

  payment = [
    { name: 'Type of payment', abbrev: '' },
    { name: '', abbrev: '' },
    { name: '', abbrev: '' },
  ];

  id = new FormControl('');

  cred_defaults = new FormControl('');

  creditRequest = new FormGroup({
    main_account: new FormControl(''),
    amount: new FormControl(''),
    payment_number: new FormControl(''),
    fees_rate: new FormControl(''),
    fees_amount: new FormControl(''),
    period: new FormControl(''),
    fieldPaymentNumber: new FormControl(''),
    first_date: new FormControl(''),
    penalities_rate: new FormControl(''),
    interest_rate: new FormControl(''),
  });

  credits!: CreditListModel;
  isLoading = false;
  selectedMenu = 'list';

  // clientId: any;

  constructor(private creditService: CreditService) {}

  ngOnInit(): void {
    // this.route.params.subscribe({
    //   next: (data) => {
    //     this.clientId = data['id'];
    //
    //   },
    // });
    this.getCreditsList();
  }

  getCreditsList() {
    this.creditService
      .getCreditsList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: credits => {
          this.credits = credits.objects;
        },
      });
  }
  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }

  // loanRequest() {
  //   this.isLoading = true;
  //   const body = {
  //     main_account: this.creditRequest.value.main_account,
  //     amount: this.creditRequest.value.amount,
  //     payment_number: this.creditRequest.value.payment_number,
  //     period: this.creditRequest.value.period,
  //     first_date: this.creditRequest.value.first_date,
  //     interest_rate: this.creditRequest.value.interest_rate,
  //     penalities_rate: this.creditRequest.value.penalities_rate,
  //     fees_rate: this.creditRequest.value.fees_rate,
  //     fees_amount: this.creditRequest.value.fees_amount,
  //     // cred_defaults:this.cred_defaults,
  //   };
  //   this.creditService
  //     .creditRequest(body)
  //     .pipe(takeUntil(this.onDestroy$))
  //     .subscribe({
  //       next: (response) => {
  //         console.log(response);
  //
  //         this.isLoading = false;
  //         this.dialogService.openToast({
  //           title: '',
  //           type: 'success',
  //           message: 'Request sent successfully',
  //         });
  //       },
  //       error: msg => {
  //         console.log('error', msg);
  //         this.isLoading = false;
  //
  //         this.dialogService.openToast({
  //           title: '',
  //           type: 'failed',
  //           message:
  //             'Failed, please try again or check if all the field are completed ',
  //         });
  //       },
  //     });
  // }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
