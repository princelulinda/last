import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../../../core/services/agent/agent.service';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { MerchantModel } from '../agent.models';
import { RouterLink } from '@angular/router';
import { PaginationConfig } from '../../../../global/models/pagination.models';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../../core/services';
import { PaginationComponent } from '../../../../global/components/list/pagination/pagination.component';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    SkeletonComponent,
    PaginationComponent,
    ProfileCardComponent,
  ],
  templateUrl: './merchant-list.component.html',
  styleUrl: './merchant-list.component.scss',
})
export class MerchantListComponent implements OnInit, OnDestroy {
  private OnDestroy$: Subject<void> = new Subject<void>();
  data!: MerchantModel[];
  Loading = true;
  merchantsPagination: PaginationConfig = {
    filters: {
      limit: 12,
      offset: 0,
    },
  };

  activePage = 1;
  count = 0;

  constructor(
    private merchantService: AgentService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getDataMerchant();
  }

  getDataMerchant(): void {
    this.Loading = true;
    this.merchantService
      .getMerchantInfos(this.merchantsPagination)
      .pipe(takeUntil(this.OnDestroy$))
      .subscribe({
        next: response => {
          this.data = response.objects;
          this.count = response.count;
          this.Loading = false;
        },
        error: () => {
          this.Loading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'failed to get merchants list',
          });
        },
      });
  }

  onPaginationChange(pagination: PaginationConfig) {
    this.merchantsPagination = pagination;
    this.activePage = pagination.filters.offset / pagination.filters.limit + 1;
    this.getDataMerchant();
  }

  ngOnDestroy() {
    this.OnDestroy$.next();
    this.OnDestroy$.complete();
  }
}
