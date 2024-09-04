import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ApiService,
  ConfigService,
  GeneralService,
} from '../../../core/services';
import { CommonModule } from '@angular/common';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { MultiSelectModel } from './multi-select.model';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class MultiSelectComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  @Input() url = '';
  @Input() name!: string;
  @Input() defaultDataIds: MultiSelectModel[] = [];
  @Output() selectedItemEvent = new EventEmitter<MultiSelectModel[] | null>();

  //   search = new FormControl('');
  // searchForm = new FormGroup({
  //     search: new FormControl('')
  // });
  search = new FormControl('');

  newData: MultiSelectModel[] = [];
  selectedItem: MultiSelectModel[] = [];
  defaultRolesId: MultiSelectModel[] = [];
  selectedItemIds: MultiSelectModel[] = [];
  defaultData: MultiSelectModel[] = [];
  allData!: MultiSelectModel[];
  selectedData: MultiSelectModel[] = [];

  loadingData = true;
  searchLoading = false;

  theme!: ModeModel;
  theme$!: Observable<ModeModel>;

  showSelectedPopup = false;

  dataNotFound = false;
  searchNotFound!: boolean;

  constructor(
    private apiService: ApiService,
    // private store: Store,
    private generalService: GeneralService,
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
    this.getData();
  }

  getData() {
    this.apiService
      .get<{ objects: MultiSelectModel[] }>(this.url)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: { objects: MultiSelectModel[] }) => {
          this.allData = data.objects;

          this.removeDefaultData();

          this.loadingData = false;
        },
        error: () => {
          this.dataNotFound = true;
          this.loadingData = false;
        },
      });
  }

  selectItem(item: MultiSelectModel) {
    if (!this.selectedItemIds.includes(item)) {
      this.selectedItemIds.push(item);
      // this.defaultRolesId.push(item.id);
      this.selectedData.unshift(item);
      // this.defaultData.unshift(item);
      this.selectedItem.push(item);
    } else {
      const indexIds = this.selectedItemIds.indexOf(item);
      const index1Default = this.defaultData.indexOf(item);
      const indexSelectedItem = this.selectedItem.indexOf(item);
      const indexSelectedData = this.selectedData.indexOf(item);
      const indexDefaultRoles = this.defaultRolesId.indexOf(item);

      this.selectedItemIds.splice(indexIds, 1);
      this.defaultData.splice(index1Default, 1);
      this.selectedItem.splice(indexSelectedItem, 1);
      this.selectedData.splice(indexSelectedData, 1);
      this.defaultRolesId.splice(indexDefaultRoles, 1);

      if (this.selectedItemIds.length === 0) {
        const items = null;
        this.selectedItemEvent.emit(items);
      }
    }
    const items = this.selectedItemIds;
    this.selectedItemEvent.emit(items);
  }

  filtItem() {
    this.searchLoading = true;

    this.generalService
      .DoAutocomplete(this.url, this.search.value as string)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        const responsive = data as { objects: MultiSelectModel[] };
        this.allData = responsive.objects;
        this.searchNotFound = false;
        if (this.allData.length === 0) {
          this.searchNotFound = true;
          this.searchLoading = false;
          return;
        }
        this.removeDefaultData(true);
        this.searchLoading = false;
      });
  }

  toggleSelectedPopup() {
    if (this.selectedItemIds.length >= 1) {
      this.showSelectedPopup = !this.showSelectedPopup;
    }
  }

  private removeDefaultData(searching = false) {
    // if (!this.defaultDataIds) {
    //     this.newData = this.allData;
    // }

    if (this.defaultDataIds) {
      if (!searching) {
        this.defaultData = this.allData.filter((item: MultiSelectModel) => {
          return this.defaultDataIds.includes(item);
        });
      }

      // this.newData = this.allData.filter((item: any) => {
      //     return !this.defaultDataIds.includes(item.id);
      // });
    }
    this.newData = this.allData;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
