import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { DialogService, GeneralService } from '../../../core/services';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { MetadataModel } from '../metadata.model';

@Component({
  selector: 'app-metadata',
  standalone: true,
  imports: [
    MetadataFormComponent,
    CommonModule,
    ReactiveFormsModule,
    SkeletonComponent,
  ],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.scss',
})
export class MetadataComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  selectedMenu = 'list';
  metadata: MetadataModel[] = [];
  isLoading = false;
  loadingData = true;

  search = new FormControl('');
  pagination = new PaginationConfig();
  canMoveToPrev = false;
  canMoveToNext = true;
  currentPage = 0;
  count = 0;
  dialog$: Observable<DialogResponseModel>;

  constructor(
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }
  ngOnInit(): void {
    this.pagination.filters.limit = 15;
    this.getMetadata();
  }

  getMetadata() {
    this.loadingData = true;
    this.metadata = [];
    const searchValue = this.search.value ?? '';
    if (searchValue !== '') {
      // reset offset when we search
      if (this.pagination?.filters.offset ?? 0 >= 1) {
        this.pagination.filters.offset = 0;
        this.currentPage = 0;
      }
    }
    this.generalService
      .getMetadata(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.metadata = data.objects;
          this.count = data.count;
          this.loadingData = false;
        },
        error: (err: { object: { response_message: string } }) => {
          this.loadingData = false;
          this.dialogService.openToast({
            type: 'failed',
            title: '',
            message:
              err?.object?.response_message ??
              $localize`Something went wrong please retry again `,
          });
        },
      });
  }

  seeUpdates(updates: string) {
    if (updates === 'success') {
      this.refresh();
    } else if (updates === 'list') {
      this.selectedMenu = 'list';
    }
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
      this.getMetadata();
    }
  }

  refresh() {
    this.metadata = [];
    this.search.setValue('');
    this.getMetadata();
    if (this.selectedMenu !== 'list') {
      this.selectedMenu = 'list';
      this.metadata = [];
      this.getMetadata();
    }
  }
  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
