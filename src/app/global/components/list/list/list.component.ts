import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Subject, Observable, takeUntil } from 'rxjs';

import { GeneralService, DialogService } from '../../../../core/services';
import { PaginationConfig } from '../../../models/pagination.models';
import {
  ListHeadersModel,
  selectedPeriodModel,
  getdataModel,
  ParamModel,
  OverviewModel,
} from '../list.models';
import { SkeletonComponent } from '../../loaders/skeleton/skeleton.component';
import { NotFoundPageComponent } from '../../empty-states/not-found-page/not-found-page.component';
import { EmptyStateComponent } from '../../empty-states/empty-state/empty-state.component';
import { TooltipDirective } from '../../../directives/tooltip/tooltip.directive';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SkeletonComponent,
    CommonModule,
    NotFoundPageComponent,
    RouterLink,
    FormsModule,
    EmptyStateComponent,
    TooltipDirective,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) headers: ListHeadersModel[] = [];
  @Input({ required: true }) url = '';

  showAmount = false;

  @Input() hasOverview = true;
  @Input() todayDate = false;
  @Input() limit = 20;
  @Input() addButtonLink: { url: string; fragment?: string } = {
    url: '',
    fragment: '',
  };
  overviewCount = 0;
  totalItems = 0;
  searchName = new FormControl('');
  selectedPeriod!: selectedPeriodModel;
  data_list: {
    value: string;
    size: string;
    css: string;
    icon: string;
    detail: string;
    boolean: boolean;
    format: string;
    class: string;
    canBeDisplayed: string;
    option1: string;
    option2: string;
    value1: string;
    value2: string;
    isSelected?: boolean;
  }[][];
  checkAll = false;

  @Input() filters = [
    {
      name: 'Date',
      title: 'date',
      value: [
        { title: 'Date', value: 'date', type_field: 'date' },
        { title: 'Period', value: 'period', type_field: 'date' },
      ],
    },
    {
      name: 'Status',
      title: 'status',
      value: [
        { title: 'Activate', value: 'A', type_field: 'checkbox' },
        { title: 'Deactivate', value: 'D', type_field: 'checkbox' },
      ],
    },
  ];

  clientPagination = new PaginationConfig();
  currentPage = 0;
  pages = 0;

  response_data!: getdataModel;
  boolean = false;
  isLoading = false;
  showFilters = false;
  showFilterComponent = false;
  overViewData: OverviewModel[] = [];
  currentExcelPage = 0;
  excelOffset = 0;
  exportCount = 0;
  round = 0;
  exportingState = 0;
  isExporting = false;
  showNotification = false;
  amountState = false;
  theme!: string;
  amountState$: Observable<boolean>;
  i!: number;
  plateform = '';
  displayPaginationLimit = false;
  pageInput = new FormControl();

  paginationsLimit = [50, 40, 30, 20, 10, 5];

  overviewOption = {
    hidden: false,
    image_url: '../../../../../assets/images/arrow-down.svg',
    title: 'Hide the overview',
  };
  overviewUrl = '';
  loadingOverview = false;

  constructor(
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {
    this.amountState$ = this.dialogService.getAmountState();
    this.data_list = [];
  }

  ngOnInit(): void {
    this.clientPagination.filters.limit = this.limit;

    // NOTE :: GET FORMATTED OVERVIEW URL
    this.overviewUrl = this.getOverviewUrl();

    this.getData();

    this.amountState$.subscribe({
      next: state => {
        this.amountState = state;
      },
    });
  }

  // showAmounts() {
  //   this.showAmount = !this.showAmount;
  // }

  toggleEyeStatus() {
    this.dialogService.displayAmount();
  }

  isSearchInputNotEmpty(): boolean {
    const searchValue = this.searchName.value;
    return searchValue?.trim() !== '';
  }

  handleEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.search();
  }

  getData() {
    let params: ParamModel[] = [];
    if (this.searchName.value !== '') {
      params = [{ title: 'search', value: this.searchName.value }];
      if (this.clientPagination?.filters.offset ?? 0 >= 1) {
        this.clientPagination.filters.offset = 0;
        this.currentPage = 0;
      }
    }

    if (this.selectedPeriod) {
      params.push(
        { title: 'date_from', value: this.selectedPeriod.startDate },
        { title: 'date_to', value: this.selectedPeriod.endDate }
      );
    }

    this.isLoading = true;
    this.generalService
      .getData(this.url, this.clientPagination, params)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: getdataModel) => {
          this.response_data = data;
          this.totalItems = data.count;
          this.data_list = [];
          // this.searchName.setValue('');

          if (this.clientPagination.filters.limit) {
            this.pages = ~~(
              this.response_data.count / this.clientPagination.filters.limit
            );
          }
          this.isLoading = false;

          if (data.objects) {
            for (const row of data.objects) {
              const line = [];

              for (const header of this.headers) {
                const fields = header['field'];
                let row1 = row;
                let css = '';
                let icon = '';
                let detail = '';
                let full_field = '';
                let class_type = '';

                for (const field in fields) {
                  row1 = row;
                  const all_fields = fields[field].split('.');

                  for (const all_field in all_fields) {
                    if (
                      row1 &&
                      typeof row1 === 'object' &&
                      all_field in all_fields
                    ) {
                      row1 = row1[all_fields[all_field]];
                    } else {
                      row1 = '------';
                    }
                  }
                  if (row1) {
                    full_field += row1 + ' ';
                  }
                }
                row1 = full_field;

                if (header['css']) {
                  const css_fields = header['css'].split('.');
                  let cssValue = row;
                  for (const css_field of css_fields) {
                    if (
                      cssValue &&
                      typeof cssValue === 'object' &&
                      css_field in cssValue
                    ) {
                      cssValue = cssValue[css_field];
                    } else {
                      css = '------';
                      break;
                    }
                  }
                  if (typeof cssValue === 'string') {
                    css = cssValue;
                  }
                }

                if (header['icon']) {
                  const icon_fields = header['icon'].split('.');
                  let iconValue = row;
                  for (const icon_field of icon_fields) {
                    if (
                      iconValue &&
                      typeof iconValue === 'object' &&
                      icon_field in iconValue
                    ) {
                      iconValue = iconValue[icon_field];
                    } else {
                      icon = '------';
                      break;
                    }
                  }
                  if (typeof iconValue === 'string') {
                    icon = iconValue;
                  }
                }

                if (header['detail']) {
                  const link = header['detail']['link'];
                  const detail_fields = header['detail']['field'].split('.');
                  let detailValue = row;
                  for (const detail_field of detail_fields) {
                    if (
                      detailValue &&
                      typeof detailValue === 'object' &&
                      detail_field in detailValue
                    ) {
                      detailValue = detailValue[detail_field];
                    } else {
                      detail = '------';
                      break;
                    }
                  }
                  detail = link + detailValue;
                }

                if (header['boolean']) {
                  this.boolean = true;
                } else {
                  this.boolean = false;
                }

                if (header['class'] && header['class'] === 'badge') {
                  class_type = 'badge bg-' + css + ' text-' + css;
                }

                // Display or not the field
                if (header['canBeDisplayed'] === false) {
                  header['canBeDisplayed'] = false;
                } else {
                  header['canBeDisplayed'] = true;
                }
                const data = {
                  value: row1 || '',
                  size: header['size'] || '',
                  css: css,
                  icon: icon,
                  detail: detail,
                  boolean: this.boolean,
                  format: header['format'] || '',
                  class: class_type,
                  canBeDisplayed: header['canBeDisplayed'] ? 'true' : 'false',
                  option1: header['option1'] || '',
                  option2: header['option2'] || '',
                  value1: header['value1'] || '',
                  value2: header['value2'] || '',
                };
                line.push(data);
              }
              this.data_list.push(line);
            }
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reverseList() {
    this.data_list.reverse();
    return;
  }

  doListMove(action: string) {
    const totalPages = Math.ceil(
      this.totalItems / this.clientPagination.filters.limit
    );

    switch (action) {
      case 'next':
        this.currentPage = Math.min(this.currentPage + 1, totalPages - 1);
        break;
      case 'previous':
        this.currentPage = Math.max(this.currentPage - 1, 0);
        break;
      case 'first':
        this.currentPage = 0;
        break;
      case 'last':
        this.currentPage = totalPages - 1;
        break;
      case 'goToPage': {
        const pageElement = document.querySelector(
          'span[contenteditable="true"]'
        ) as HTMLElement;
        const page = parseInt(pageElement?.textContent?.trim() || '0', 10) - 1;
        this.currentPage = Math.max(0, Math.min(page, totalPages - 1));
        break;
      }
    }

    // Mettre à jour l'offset de la pagination
    this.clientPagination.filters.offset =
      this.clientPagination.filters.limit * this.currentPage;

    // Recharger les données
    this.getData();
  }
  get start(): number {
    return this.currentPage * this.clientPagination.filters.limit + 1;
  }

  get end(): number {
    const calculatedEnd =
      (this.currentPage + 1) * this.clientPagination.filters.limit;
    return calculatedEnd > this.response_data.count
      ? this.response_data.count
      : calculatedEnd;
  }

  search() {
    this.getData();
  }

  toggleAllCheckboxes(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkAll = target.checked;

    const checkboxes = document.querySelectorAll('.row input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      (checkbox as HTMLInputElement).checked = this.checkAll;
    });
  }

  displayFilters() {
    if (this.showFilters) {
      this.showFilters = false;
    } else {
      this.showFilters = true;
    }
  }

  openPagination() {
    if (this.displayPaginationLimit) {
      this.displayPaginationLimit = false;
    } else {
      this.displayPaginationLimit = true;
    }
  }

  selectPagintationLimit(pagination: number) {
    this.clientPagination.filters.limit = pagination;
    this.openPagination();
    this.getData();
  }

  canMoveNext(limit: number): boolean {
    return this.response_data.count < (this.currentPage + 1) * limit;
  }

  getOverviewData() {
    // if (!this.loadingOverview && this.overViewData.length > 0) {
    this.loadingOverview = true;
    this.generalService
      .getOverviewData(this.overviewUrl)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.overViewData = data.object;
          this.overviewCount = data.count;
          this.loadingOverview = false;
        },
        error: () => {
          this.loadingOverview = false;
        },
      });
    // }
  }

  // openOverview() {
  //   if (!this.overviewOption.hidden) {
  //     this.overviewOption.hidden = true;
  //     this.overviewOption.image_url =
  //       '../../../../../assets/images/arrow-up.svg';
  //     this.overviewOption.title = 'Open the overview';
  //   } else {
  //     this.overviewOption.hidden = false;
  //     this.overviewOption.image_url =
  //       '../../../../../assets/images/arrow-down.svg';
  //     this.overviewOption.title = 'Hide the overview';
  //   }
  // }

  private getOverviewUrl(): string {
    let url = this.url;
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
      if (!url.endsWith('/')) {
        url = url.concat('/');
      }
      url = url.concat('objects_overview/');
    }
    return url;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
