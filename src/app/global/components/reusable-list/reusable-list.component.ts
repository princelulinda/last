import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginationConfig } from '../../global.model';
import { GeneralService } from '../../../core/services';
import { NgClass } from '@angular/common';
import { SkeletonComponent } from '../loaders/skeleton/skeleton.component';
import {
  Header,
  ParamModel,
  getdataModal,
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

  //   @Input() headers: any;

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

  theme!: string;

  plateform = '';
  displayPaginationLimit = false;
  paginationsLimit = [50, 40, 30, 20, 10, 5];
  overviewOption = {
    hidden: false,
    image_url: '../../../../../assets/images/arrow-down.svg',
    title: 'Hide the overview',
  };

  constructor(private generalService: GeneralService) {
    this.data_list = [];
    // this.headers = [];
  }

  ngOnInit(): void {
    this.clientPagination.filters.limit = this.limit;
    this.getData();

    //   this.showBalaceStatusEye = this.showCurrencyEye(this.headers);
  }

  showAmounts() {
    this.showAmount = !this.showAmount;
    // this.store.dispatch(new displayAmount({ show: this.showAmount }));
  }
  // to do add a routerLink

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
                // make field as list so we can separate the '.'
                const fields = header['field'];
                // this variable is created just for protected row values in loop, Please if you have a suggestion let me know
                let row1 = row;
                let css = '';
                const icon = '';
                const detail = '';
                let full_field = '';
                let class_type = '';

                // loop for separating fields
                for (const field in fields) {
                  row1 = row;
                  const all_fields = fields[field].split('.');

                  for (const all_field in all_fields) {
                    if (row1) {
                      row1 = row1[all_field];
                    } else {
                      row1 = '------';
                    }
                  }
                  if (row1) {
                    full_field += row1 + ' ';
                  }
                }
                row1 = full_field;

                // loop for separating css
                //   if (header['css']) {
                //       let css_fields = header['css'];
                //       css = row;
                //       css_fields = css_fields.split('.');
                //       for (const css_field in css_fields) {
                //           css = css[css_fields[css_field]];
                //       }
                //   }

                if (header['css']) {
                  const css_fields: string[] = header['css'].split('.');
                  css = row;
                  for (const css_field in css_fields) {
                    css = css[css_field];
                  }
                }

                // loop for separating icon
                //   if (header['icon']) {
                //       let icon_fields = header['icon'];
                //       icon = row;
                //       icon_fields = icon_fields.split('.');
                //       for (const icon_field in icon_fields) {
                //           icon = icon[icon_fields[icon_field]];
                //       }
                //   }

                //get link url
                //   if (header['detail']) {
                //       const link = header['detail']['link'];
                //       let detail_fields =
                //           header['detail']['field'];
                //       detail = row;
                //       detail_fields = detail_fields.split('.');
                //       for (const detail_field in detail_fields) {
                //           detail =
                //               detail[detail_fields[detail_field]];
                //       }
                //       detail = link + detail;
                //   }

                //   if (header['boolean']) {
                //       this.boolean = true;
                //   } else {
                //       this.boolean = false;
                //   }

                if (header['class'] && header['class'] === 'badge') {
                  class_type = 'badge bg-' + css + ' text-' + css;
                }

                // Display or not the field
                //   if (header['canBeDisplayed'] === false) {
                //       header['canBeDisplayed'];
                //   } else {
                //       header['canBeDisplayed'] = true;
                //   }

                // data of a one row
                const data = {
                  value: row1,
                  size: header['size'],
                  css: css,
                  icon: icon,
                  detail: detail,
                  boolean: this.boolean,
                  format: header['format'],
                  class: class_type,
                  canBeDisplayed: header['canBeDisplayed'],
                  //   option1: header['option1'],
                  //   option2: header['option2'],
                  //   value1: header['value1'],
                  //   value2: header['value2'],
                };
                line.push(data);
              }
              //   this.data_list.push(line);
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
