import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { CounterService } from '../../../core/services/counter/counter.service';
import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../global/components/list/pagination/pagination.component';
import { CounterListModel } from '../operation.model';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkeletonComponent,
    RouterLink,
    PaginationComponent,
  ],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  counters: CounterListModel[] | null = null;
  isLoading = false;
  crumbs = [
    {
      label: 'Agency',
      active: true,
    },
  ];

  searchCounter = new FormControl('');
  pagination: PaginationConfig = {
    filters: {
      limit: 10,
      offset: 0,
    },
  };
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  pages!: number;
  count!: number;

  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  constructor(
    private counterService: CounterService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
  }

  ngOnInit() {
    this.getCounters();
    this.theme$.subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    this.searchCounter.valueChanges.pipe(debounceTime(300)).subscribe({
      next: search => {
        this.getCounters(search ?? '');
      },
    });
  }

  getCounters(searchValue = '') {
    this.isLoading = true;

    if (searchValue !== '') {
      // reset offset when we search
      if (this.pagination?.filters.offset ?? 0 >= 1) {
        this.pagination.filters.offset = 0;
        this.currentPage = 0;
      }
    }

    this.counterService
      .getCounters(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const res = data as { objects: CounterListModel[]; count: number };
          this.counters = res.objects;
          this.isLoading = false;
          this.count = res.count;
        },
        error: error => {
          this.isLoading = false;
          return error;
        },
      });
  }

  doListMove(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    // condition just for typescript
    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      this.getCounters(this.searchCounter.value ?? '');
    }
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.pagination = pagination;
    this.currentPage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getCounters();
  }

  refresh() {
    this.counters = [];
    this.getCounters();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
