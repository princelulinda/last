import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { GeneralService } from '../../../core/services';
import {
  AutocompleteModel,
  FiltersModel,
  LookupModel,
} from '../../../global/models/global.models';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [LookupComponent, ReactiveFormsModule, NgClass],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  // private filtersSignal: WritableSignal<string> = signal('');
  @Input({ required: true }) url = '';
  @Output() filtersEvent = new EventEmitter<string>();

  filtersData: FiltersModel = { filters: [], ordering: [] };
  filtersUrl = '';
  isLoading = false;

  filtersFormGroup = this.fb.group({});

  showFiltersCard = false;

  formatedUrls: Record<string, string> = {};

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filtersUrl = this.formatUrlToFilters();
    this.getFilters();
    // this.filtersData.filters = [
    //   {
    //     title: 'Client',
    //     name: 'account_client',
    //     type: 'autocomplete',
    //     data: { url: '/currency/objects_autocomplete/?search=' },
    //   },
    //   {
    //     title: 'Account Status',
    //     name: 'account_status',
    //     type: 'select',
    //     data: {
    //       choices: [
    //         { title: 'All', value: 'L', selected: true },
    //         { title: 'Active', value: 'A' },
    //         { title: 'Inactive', value: 'I' },
    //       ],
    //     },
    //   },
    //   {
    //     title: 'Client classification',
    //     name: 'account_status',
    //     type: 'select_multiple',
    //     data: {
    //       choices: [
    //         { title: 'Regular', value: 'R' },
    //         { title: 'Compromis', value: 'C' },
    //         { title: 'Contentieux', value: 'O' },
    //         { title: 'Douteux', value: 'D' },
    //       ],
    //     },
    //   },
    //   {
    //     title: 'Is secret account ?',
    //     name: 'account_is_secret',
    //     type: 'bool',
    //     data: null,
    //   },
    //   {
    //     title: 'Birthday',
    //     name: 'account_client_birth',
    //     type: 'date',
    //     data: null,
    //   },
    //   {
    //     title: 'Minimal age',
    //     name: 'account_client_min_age',
    //     type: 'form_value',
    //     data: { field_type: 'number' },
    //   },
    //   {
    //     title: 'Balance',
    //     name: 'account_amount',
    //     type: 'range',
    //     data: { min: 5000, max: 15000000, step: 1 },
    //   },
    // ];

    this.generateFilterForm();
  }

  applyFilters() {
    const filters: string = Object.entries(this.filtersFormGroup.value)
      .filter(([value]) => value !== '')
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    this.filtersEvent.emit(filters);
  }

  getFilters() {
    this.isLoading = false;
    this.generalService.getListFilters(this.filtersUrl).subscribe({
      next: response => {
        this.filtersData = response.object;

        // TODO :: CHECK BACK URLS , AND CHECK IF THIS FORMAT WORK
        this.filtersData.filters.map(filter => {
          if (filter.data?.url) {
            return this.formBackUrls(filter.data?.url);
          }
          return;
        });

        this.generateFilterForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getAutocompleteData(response: AutocompleteModel | null, controlName: string) {
    this.filtersFormGroup.patchValue({ [controlName]: response?.id });
  }

  getLookupData(response: LookupModel | null, controlName: string) {
    this.filtersFormGroup.patchValue({ [controlName]: response?.id });
  }

  private generateFilterForm() {
    let data = {};
    for (const filter of this.filtersData.filters) {
      if (filter.type === 'select_multiple' && filter.data?.choices) {
        let choice_controls: FormGroup = this.fb.group({});
        for (const choice of filter.data.choices) {
          choice_controls = this.fb.group({
            ...choice_controls,
            [choice.title]: [''],
          });
        }
        console.log(choice_controls);
        data = {
          ...data,
          // [filter.name]: this.fb.group({...choice_controls}),
        };
      } else {
        data = {
          ...data,
          [filter.name]: [''],
        };
      }
    }
    console.log(data);
    this.filtersFormGroup = this.fb.group({ ...data });
  }

  toogleFilterCard() {
    this.showFiltersCard = !this.showFiltersCard;
  }

  // NOTE :: FORMAT URLS FOR AUTOCOMPLETE AND FOR LOOKUP
  private formBackUrls(url: string): string {
    return url.replace('/api/v1', '');
  }

  private formatUrlToFilters(): string {
    let url = this.url;
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
      if (!url.endsWith('/')) {
        url = url.concat('/');
      }
      url = url.concat('objects_filtering_data/');
    }
    return url;
  }
}
