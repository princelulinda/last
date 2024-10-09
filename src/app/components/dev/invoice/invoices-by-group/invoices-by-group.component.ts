import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import {
  EmptyStateComponent,
  EmptyStateModel,
} from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { InvoiceGroupModel, SingleInVoiceModel } from '../invoice.models';
import { AmountVisibilityComponent } from '../../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-invoices-by-group',
  standalone: true,
  imports: [
    RouterLink,
    SkeletonComponent,
    EmptyStateComponent,
    AmountVisibilityComponent,
  ],
  templateUrl: './invoices-by-group.component.html',
  styleUrl: './invoices-by-group.component.scss',
})
export class InvoicesByGroupComponent {
  @Input() group_name!: InvoiceGroupModel;
  @Input() teller_id!: number;
  @Input({ required: true }) invoices!: SingleInVoiceModel;
  @Output() goBackEvent = new EventEmitter<boolean>();
  searchType: EmptyStateModel = 'product';

  goBack() {
    const isSelected_group = false;
    this.goBackEvent.emit(isSelected_group);
  }
}
