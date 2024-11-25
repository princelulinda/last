import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { DialogService } from '../../../../core/services';
import { GeneralService } from '../../../../core/services/general/general.service';
import { AutocompleteModel, LookupModel } from '../../../models/global.models';

@Component({
  selector: 'app-lookup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss',
})
export class LookupComponent implements OnInit {
  showAutoComplete = false;

  selectedItem: LookupModel | AutocompleteModel | null = null;
  autocompleteItems: AutocompleteModel[] = [];

  isLoading = false;

  search = new FormControl('');
  lookup = new FormControl('');

  @Input({ required: true }) option!: 'lookup' | 'autocomplete';

  @Output() selectedItemEvent = new EventEmitter<AutocompleteModel | null>();
  @Input({ required: true }) url!: string;
  @Input({ required: true }) label!: string;
  @Input() selectedId: number | null = null;
  @Input() showProfile = true;
  @Input() lookupDefaultSearch = '';
  @Input() classes: string | null = 'rounded';
  @Input() isAgentTransfer = false;

  title = '';
  type = '';
  message = '';

  constructor(
    private generalService: GeneralService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.title = $localize`title`;
    this.type = $localize`type`;
    this.message = $localize`message`;

    this.search.setValue('');
    if (this.option === 'autocomplete') {
      this.initAutocomplete();
    } else {
      if (this.lookupDefaultSearch) {
        this.lookup.setValue(this.lookupDefaultSearch);
        this.DoLookup();
      }
    }
  }

  inputFocused() {
    this.showAutoComplete = true;
  }

  setSelectedItem(item: LookupModel | AutocompleteModel) {
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

  initAutocomplete() {
    if (
      (this.autocompleteItems.length === 0 || !this.autocompleteItems) &&
      this.search.value === ''
    ) {
      this.isLoading = true;

      this.generalService.DoAutocomplete(this.url, '').subscribe(value => {
        const res = value as { objects: LookupModel[] };
        this.autocompleteItems = res.objects;
        this.isLoading = false;
        if (this.selectedId) {
          const items: LookupModel[] = this.autocompleteItems;
          this.selectedItem = items.filter(item => {
            if (item.id === this.selectedId) {
              return item;
            }
            return null;
          })[0];
          if (this.selectedItem) {
            this.setSelectedItem(this.selectedItem);
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
          const res = value as { objects: LookupModel[] };
          this.autocompleteItems = res.objects;
          this.isLoading = false;
        });
    } else {
      this.generalService.DoAutocomplete(this.url, '').subscribe(value => {
        const res = value as { objects: LookupModel[] };
        this.autocompleteItems = res.objects;
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
          const response = item as { objects: LookupModel[] };
          this.setSelectedItem(response.objects[0]);
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
}
