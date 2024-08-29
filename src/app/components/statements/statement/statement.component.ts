import {
  Component,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BankService } from '../../../core/services';
import { ReusableListComponent } from '../../../global/components/reusable-list/reusable-list.component';
import { AccountModel, StatementModel } from '../statement.model';
import { Accountdetail } from '../../account/models';
import { AccountInfoModel } from '../../dashboards/dashboard.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReusableListComponent,
  ],
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
})
export class StatementComponent implements OnChanges, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  @Input({ required: true }) accountId = '';
  @Input() ledgerId = '';
  @Input() account: AccountModel | AccountInfoModel | Accountdetail | null =
    null;
  dateFrom = new FormControl('', Validators.required);
  dateEnd = new FormControl('', Validators.required);
  isLoadingStatement = false;
  statements: StatementModel | null = null;
  headers = [
    {
      name: 'Date',
      field: ['date_created'],
      size: '',
      format: 'date',
    },
    {
      name: 'Description',
      field: ['description'],
      size: '',
    },
    {
      name: 'Reference',
      field: ['reference'],
      size: '',
    },
    {
      name: 'Debit amount',
      field: ['debit'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Credit amount',
      field: ['credit'],
      size: '',
      format: 'currency',
    },
    {
      name: 'Balance',
      field: ['solde'],
      size: '',
      format: 'currency',
    },
  ];

  url = '';

  constructor(private bankService: BankService) {
    //comment
  }
  ngOnit() {
    console.log('accountId value', this.accountId);
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chng = changes[propName];
      if (propName === 'accountId') {
        this.url =
          '/operations/all/statement/?trans_client_account_obj=' +
          chng.currentValue +
          '&';
        this.accountId = chng.currentValue;
      }
      if (propName === 'ledgerId') {
        this.url =
          '/operations/all/statement/?trans_ledger_account_obj=' +
          chng.currentValue +
          '&';
        this.ledgerId = chng.currentValue;
      }
    }
  }

  getAccountStatements() {
    const id: string = this.accountId || this.ledgerId || '';
    this.isLoadingStatement = true;

    const dateFromValue = this.dateFrom.value
      ? new Date(this.dateFrom.value)
      : null;
    const dateEndValue = this.dateEnd.value
      ? new Date(this.dateEnd.value)
      : null;

    if (!dateFromValue || !dateEndValue) {
      console.error('Invalid date range: dateFrom or dateEnd is null.');
      this.isLoadingStatement = false;
      return;
    }

    const dateFrom = this.bankService.dissectDate(dateFromValue);
    const dateEnd = this.bankService.dissectDate(dateEndValue);

    this.bankService
      .getAccountStatements(id, dateFrom, dateEnd)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: statements => {
          this.statements = statements as StatementModel;
          this.isLoadingStatement = false;
        },
        error: msg => {
          console.log('error', msg);
          this.isLoadingStatement = false;
        },
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
