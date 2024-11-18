import { Component, Input, Output, OnInit } from '@angular/core';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { GeneralService } from '../../../core/services';
import {
  AutocompleteModel,
  FiltersModel,
  LookupModel,
} from '../../../global/models/global.models';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [LookupComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  @Input({ required: true }) url = '';
  @Output() filters = '';

  filtersData: FiltersModel = { filters: [], ordering: [] };
  filtersUrl = '';
  isLoading = false;

  autocompleteData: AutocompleteModel | null = null;
  lookupData: LookupModel | null = null;

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filtersUrl = this.formatUrlToFilters();
    // this.getFilters();
    this.filtersData.filters = [
      {
        title: 'Client',
        name: 'account_client',
        type: 'autocomplete',
        data: { url: '/currency/objects_autocomplete/?search=' },
      },
      {
        title: 'Account Status',
        name: 'account_status',
        type: 'select',
        data: {
          choices: [
            { title: 'All', value: 'L', selected: true },
            { title: 'Active', value: 'A' },
            { title: 'Inactive', value: 'I' },
          ],
        },
      },
      {
        title: 'Client classification',
        name: 'account_status',
        type: 'select_multiple',
        data: {
          choices: [
            { title: 'Regular', value: 'R' },
            { title: 'Compromis', value: 'C' },
            { title: 'Contentieux', value: 'O' },
            { title: 'Douteux', value: 'D' },
          ],
        },
      },
      {
        title: 'Is secret account ?',
        name: 'account_is_secret',
        type: 'bool',
        data: null,
      },
      {
        title: 'Birthday',
        name: 'account_client_birth',
        type: 'date',
        data: null,
      },
      {
        title: 'Minimal age',
        name: 'account_client_min_age',
        type: 'form_value',
        data: { field_type: 'number' },
      },
      {
        title: 'Balance',
        name: 'account_amount',
        type: 'range',
        data: { min: 5000, max: 15000000, step: 1 },
      },
    ];
  }

  getFilters() {
    this.isLoading = false;
    this.generalService.getListFilters(this.filtersUrl).subscribe({
      next: response => {
        this.filtersData = response.object;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getAutocompleteData(response: AutocompleteModel | null) {
    this.autocompleteData = response;
  }

  getLookupData(response: LookupModel | null) {
    this.lookupData = response;
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
