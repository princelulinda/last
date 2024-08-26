import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationConfig } from '../../../global/models/pagination.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalData = 0;
  @Input() currentPage = 1;
  @Input() pageLimit = 20;

  @Output() pageChange = new EventEmitter<number>();

  pagination = new PaginationConfig();
  paginationsLimits = [50, 40, 30, 20, 10];

  get pages() {
    const totalPages = Math.ceil(this.totalData / this.pageLimit);
    return Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  getPaginationRange(): number[] {
    const totalPages = this.pages.length;
    if (totalPages === 0) {
      return [];
    }
    const range: number[] = [];

    range.push(1);

    if (this.currentPage > 3) {
      range.push(-1); // Use -1 as a placeholder for "..."
    }

    for (
      let i = Math.max(2, this.currentPage);
      i <= Math.min(this.currentPage + 2, totalPages - 1);
      i++
    ) {
      range.push(i);
    }

    if (this.currentPage + 2 < totalPages - 1) {
      range.push(-1); // Use -1 as a placeholder for "..."
    }

    range.push(totalPages);

    return range;
  }

  jumpNext() {
    const newPage = this.currentPage + 10;
    if (newPage <= this.pages.length) {
      this.goToPage(newPage);
    } else {
      this.goToPage(this.pages.length); // Go to the last page if the jump exceeds the total pages
    }
  }

  jumpPrev() {
    const newPage = this.currentPage - 10;
    if (newPage >= 1) {
      this.goToPage(newPage);
    } else {
      this.goToPage(1); // Go to the first page if the jump goes below the first page
    }
  }

  goToPage(page: number): void {
    this.pageChange.emit(page);
  }
}
