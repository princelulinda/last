import { Component, Input, Output, OnInit } from '@angular/core';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { GeneralService } from '../../../core/services';

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

  filtersData = [];
  filtersUrl = '';
  isLoading = false;

  constructor(private generalService: GeneralService) {}

  ngOnInit() {
    this.filtersUrl = this.formatUrlToFilters();
    this.getFilters();
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

  private formatUrlToFilters(): string {
    let url = this.url;
    if (url.endsWith('?')) {
      url = url.slice(0, -1);
      if (!url.endsWith('/')) {
        url = url.concat('/');
      }
      url = url.concat('objects_filters/');
    }
    return url;
  }
}
