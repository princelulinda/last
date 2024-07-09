import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() searchTerm: string = '';
  @Input() searchType: string = '';
  // @Input() searchResults: string[] = [];
  // @Input() isLoading: boolean = false;
  // @Input() searchType: 'list' | 'merchant' | 'product' | 'service' | 'other';
}
