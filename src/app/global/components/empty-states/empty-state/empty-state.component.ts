import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// export enum SearchTypes {
//   List = 'list',
//   Merchant = 'merchant',
//   Product = 'product',
//   Service = 'service',
//   Other = 'other',
// }

export type searchType = 'list' | 'merchant' | 'product' | 'other' | 'service';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() searchTerm = '';
  @Input() searchType: searchType = 'other';
  // @Input() searchTerm: string[] = [];
  // @Input() searchType: 'list' | 'merchant' | 'product' | 'service' | 'other';
}
