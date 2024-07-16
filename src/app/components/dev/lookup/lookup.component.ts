import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../core/services';
import { GeneralService } from '../../../core/services/general/general.service';
import { AdminService } from '../../../core/services/admin/admin.service';
import { AdminModel, ItemModel } from './lookup.model';

@Component({
  selector: 'app-lookup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss',
})
export class LookupComponent implements OnInit {
  adminMenus: AdminModel[] = [];
  showAutoComplete = false;
  selectedItem: ItemModel | null = null;

  items: ItemModel[] = [];
  search = new FormControl('');
  isLoading = false;
  @Input({ required: true }) option!: 'lookup' | 'autocomplete';
  lookup = new FormControl('');
  @Output() selectedItemEvent = new EventEmitter<ItemModel | null>();
  @Input({ required: true }) url!: string;
  @Input({ required: true }) label!: string;
  @Input() selectedId: number | null = null;
  @Input() showProfile = true;
  title = '';
  type = '';
  message = '';
  // private searchQuerySubject = new Subject<string>();

  constructor(
    private adminService: AdminService,
    // private clientService: ClientService,
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.title = $localize`title`;
    this.type = $localize`type`;
    this.message = $localize`message`;

    this.getAdminMenus();
    this.search.setValue('');
    if (this.option === 'autocomplete') {
      this.initAutocomplete();
    }
    if (this.option === 'autocomplete' && this.selectedId) {
      this.initAutocomplete();
    }
  }

  inputFocused() {
    this.showAutoComplete = true;
  }

  selectItem(item: ItemModel) {
    this.selectedItem = item;
    this.selectedItemEvent.emit(item);
    this.showAutoComplete = false;
  }

  focusOut() {
    console.log('Focusout');
  }

  deselect() {
    this.selectedItem = null;
    this.showAutoComplete = true;
    this.lookup.setValue('');
    this.selectedItemEvent.emit(null);
  }

  close() {
    this.showAutoComplete = false;
  }

  getAdminMenus() {
    this.adminService.getAdminMenuGroupList().subscribe({
      next: admins => {
        const response = admins as { objects: AdminModel[] };
        this.adminMenus = response.objects;
      },
    });
  }

  initAutocomplete() {
    console.log('!!!!!!!!!!!!!!!!!!!Items', this.items);
    console.log('!!!!!!!!!!!!!!!!!!!>>>>>>search', this.search.value);
    if (this.items.length === 0 && this.search.value === '') {
      this.isLoading = true;

      console.log('inside IIIIIIIFFFFFFF', this.isLoading);

      this.generalService.DoAutocomplete(this.url, '').subscribe(value => {
        const res = value as { objects: ItemModel[] };
        this.items = res.objects;
        this.isLoading = false;
        if (this.selectedId) {
          const items: ItemModel[] = this.items;

          this.selectedItem = items.filter(item => {
            if (item.id === this.selectedId) {
              return item;
            }
            return null;
          })[0];
          if (this.selectedItem) {
            this.selectItem(this.selectedItem);
          }
        }
      });
    }
  }

  DoAutocomplete() {
    this.isLoading = true;

    if (this.search.value) {
      this.generalService
        .DoAutocomplete(this.url, this.search.value)
        .subscribe(value => {
          const res = value as { objects: ItemModel[] };
          this.items = res.objects;
          this.isLoading = false;
        });
    } else {
      this.generalService.DoAutocomplete(this.url, '').subscribe(value => {
        const res = value as { objects: ItemModel[] };
        this.items = res.objects;
        this.isLoading = false;
      });
    }
  }

  DoLookup() {
    if (this.lookup.value !== null && this.lookup.value !== '') {
      this.isLoading = true;
      this.lookup.disable();
      this.generalService.DoLookup(this.url, this.lookup.value).subscribe({
        next: item => {
          const response = item as { objects: ItemModel[] };
          this.selectItem(response.objects[0]);
          this.isLoading = false;
          this.lookup.enable();
          if (!this.selectedItem) {
            const notFoundMessage = $localize`Search Not Found`;
            this.dialogService.openToast({
              message: notFoundMessage,
              title: '',
              type: 'failed',
            });
          }
        },
        error: () => {
          this.isLoading = false;
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message: 'Something went wrong, please retry again',
          });
        },
      });
    } else {
      this.dialogService.openToast({
        title: '',
        type: 'failed',
        message: 'Please Enter a value',
      });
    }
  }

  onChangeTest() {
    console.log('333 444 555');
  }
}
