import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationConfig } from '../../global.model';
import { GeneralService } from '../../../core/services';
import { NgClass } from '@angular/common';
import { SkeletonComponent } from '../loaders/skeleton/skeleton.component';
import { DialogService } from '../../../core/services';
import {
  ParamModel,
  getdataModal,
  Header,
  selectedPeriodModel,
} from './reusable.model';

@Component({
  selector: 'app-reusable-list',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, SkeletonComponent],
  templateUrl: './reusable-list.component.html',
  styleUrl: './reusable-list.component.scss',
})
export class ReusableListComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() headers!: Header[];
  @Input() url = '';
  @Input() title = '';
  showAmount = false;

  @Input() hasOverview = true;
  @Input() overviewUrl = '';
  @Input() todayDate = false;
  @Input() limit = 20;
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
  }[][];

  clientPagination = new PaginationConfig();
  currentPage = 0;
  response_data!: getdataModal;
  pages!: number;
  boolean = false;
  isLoading = false;
  showFilters = false;
  showFilterComponent = false;
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

  plateform = '';
  displayPaginationLimit = false;
  paginationsLimit = [50, 40, 30, 20, 10, 5];
  overviewOption = {
    hidden: false,
    image_url: '../../../../../assets/images/arrow-down.svg',
    title: 'Hide the overview',
  };

  constructor(
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {
    this.amountState$ = this.dialogService.getAmountState();
    this.data_list = [];
  }

  ngOnInit(): void {
    this.clientPagination.filters.limit = this.limit;
    this.getData();
    this.amountState$.subscribe({
      next: state => {
        this.amountState = state;
      },
    });
  }

  showAmounts() {
    this.showAmount = !this.showAmount;
    // this.store.dispatch(new displayAmount({ show: this.showAmount }));
  }
  // to do add a routerLink

  toggleEyeStatus() {
    this.dialogService.displayAmount();
  }
  getData() {
    //   this.response_data = null;
    let params: ParamModel[] = [];
    if (this.searchName.value !== '') {
      params = [{ title: 'search', value: this.searchName.value }];

      // reset offset when we search
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
        next: (data: getdataModal) => {
          this.response_data = data;
          this.data_list = [];
          if (this.clientPagination.filters.limit) {
            this.pages = ~~(
              this.response_data.count / this.clientPagination.filters.limit
            );
            // this.canMoveNext = this.response_data.count < (this.currentPage + 1) * this.clientPagination.filters.limit
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

                // for (const field of fields) {
                //   row1=row;
                //   if (row1 && typeof row1 === 'object' && field in row1) {
                //     row1 = row1[field];
                //   } else {
                //     row1 = '------';

                //   }
                // }

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
              console.log('this is line:', line);
            }
          }
        },
        error: msg => {
          console.log('Error Getting Location: ', msg);
          this.isLoading = false;
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
    if (this.clientPagination.filters.limit) {
      this.clientPagination.filters.offset =
        this.clientPagination.filters.limit * this.currentPage;
      this.getData();
    }
  }

  search() {
    this.getData();
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

  openOverview() {
    if (!this.overviewOption.hidden) {
      this.overviewOption.hidden = true;
      this.overviewOption.image_url =
        '../../../../../assets/images/arrow-up.svg';
      this.overviewOption.title = 'Open the overview';
    } else {
      this.overviewOption.hidden = false;
      this.overviewOption.image_url =
        '../../../../../assets/images/arrow-down.svg';
      this.overviewOption.title = 'Hide the overview';
    }
  }

  //   showCurrencyEye(headers: []): boolean {
  //       const element = headers.find(
  //           (object: any) => object['format'] && object.format == 'currency'
  //       );
  //       return element ? true : false;
  //   }

  //   getSelectedPeriod($event: any) {
  //       this.showFilters = false;
  //       this.selectedPeriod = $event;
  //       this.todayDate = false;
  //       this.getData();
  //   }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
