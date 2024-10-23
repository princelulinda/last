import { Component, OnInit } from '@angular/core';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CounterService } from '../../../core/services/counter/counter.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { ConfigService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { PaginationComponent } from '../../../global/components/list/pagination/pagination.component';
import {
  OperationListModel,
  OperationTransactionModel,
} from '../operation.model';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [
    CommonModule,
    AmountVisibilityComponent,
    SkeletonComponent,
    ReactiveFormsModule,
    PaginationComponent,
  ],
  templateUrl: './operation-list.component.html',
  styleUrl: './operation-list.component.scss',
})
export class OperationListComponent implements OnInit {
  private onDestroy$ = new Subject<void>();
  theme!: ModeModel;
  theme$: Observable<ModeModel>;
  selectedMenuOnCallapse = 'details';

  operations!: OperationListModel[] | null;
  transactions!: OperationTransactionModel[];
  loadingList = true;
  transactionLoading = false;
  operationTypeSelected = '';

  searchForm = this.fb.group({
    search: [''],
  });
  tempSearch = '';

  operationPagination = new PaginationConfig();
  transactionPagination = new PaginationConfig();
  transactionCurrentPage = 0;
  operationCurrentPage = 0;

  count!: number;
  transactionCount!: number;

  selectedOperation!: number;

  showFilters = false;
  // selectedPeriod: any;

  constructor(
    private counterService: CounterService,
    private fb: FormBuilder,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.operationPagination.filters.limit = 20;
    this.transactionPagination.filters.limit = 15;
    this.getOperationsList();
  }

  getOperationsList() {
    this.loadingList = true;
    const searchValue = this.searchForm.value.search ?? '';
    this.operations = null;
    // const params: any = [];

    // if (this.selectedPeriod) {
    //   params.push(
    //     { title: 'date_from', value: this.selectedPeriod.startDate },
    //     { title: 'date_to', value: this.selectedPeriod.endDate }
    //   );
    // }
    // console.log('selected', params);

    if (searchValue !== this.tempSearch && this.operationCurrentPage >= 1) {
      // reset offset when we search
      this.operationPagination.filters.offset = 0;
      this.operationCurrentPage = 0;
    }
    this.counterService
      .getOperationsList(
        searchValue,
        this.operationPagination,
        this.operationTypeSelected
      )
      .subscribe({
        next: response => {
          const res = response;
          this.tempSearch = searchValue;
          this.operations = res.objects;
          this.count = res.count;
          this.loadingList = false;
        },
        error: err => {
          this.loadingList = false;
          return err;
        },
      });
  }

  searchEmptyDetection() {
    if (this.searchForm.value.search === '') {
      this.operationPagination.filters.offset = 0;
      this.operationCurrentPage = 0;
      this.getOperationsList();
    }
  }

  getOperationTransactions(operationId: number) {
    this.transactionLoading = true;
    this.counterService
      .getOperationTransactions(
        this.selectedOperation,
        this.transactionPagination
      )
      .subscribe({
        next: response => {
          const res = response;
          this.transactionLoading = false;
          this.transactionCount = res.count;
          this.transactions = res.objects;
        },
        error: err => {
          this.transactionLoading = false;
          return err;
        },
      });
    return operationId;
  }

  refresh() {
    this.operations = null;
    this.getOperationsList();
  }

  doListMove(action: string, list_type: string) {
    switch (list_type) {
      case 'list':
        if (action === 'next') {
          this.operationCurrentPage += 1;
        } else {
          this.operationCurrentPage -= 1;
        }

        // condition just for typescript
        if (this.operationPagination.filters.limit) {
          this.operationPagination.filters.offset =
            this.operationPagination.filters.limit * this.operationCurrentPage;

          this.getOperationsList();
        }
        break;
      case 'transactions':
        if (action === 'next') {
          this.transactionCurrentPage += 1;
        } else {
          this.transactionCurrentPage -= 1;
        }

        if (this.transactionPagination.filters.limit) {
          this.transactionPagination.filters.offset =
            this.transactionPagination.filters.limit *
            this.transactionCurrentPage;
          this.getOperationTransactions(this.selectedOperation);
        }
    }
  }

  displayFilters() {
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }

  // getSelectedPeriod($event: any) {
  //   this.showFilters = false;
  //   this.selectedPeriod = $event;
  //   // this.todayDate = false;
  //   this.getOperationsList();
  // }

  onPaginationChange(pagination: PaginationConfig) {
    this.operationPagination = pagination;
    this.operationCurrentPage =
      pagination.filters.offset / pagination.filters.limit + 1;
    this.getOperationsList();
  }

  selectOperationType(operationType: string) {
    this.operationTypeSelected = operationType;
    this.getOperationsList();
  }

  setSelectedCollapseMenu(name: string) {
    this.selectedMenuOnCallapse = name;
  }

  selectOperation(operationId: number) {
    this.selectedOperation = operationId;
  }
}
