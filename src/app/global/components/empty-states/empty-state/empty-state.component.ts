import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EmptyStateModel =
  | 'list'
  | 'merchant'
  | 'product'
  | 'service'
  | 'other';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() searchTerm = '';
  @Input() searchType: EmptyStateModel = 'service';
  @Input() imageClass = '';
  @Input() messageClass = '';
}
