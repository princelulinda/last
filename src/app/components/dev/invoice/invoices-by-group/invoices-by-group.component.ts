import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../../global/components/empty-states/empty-state/empty-state.component';
import { SingleInVoiceModel } from '../invoice.models';
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
  @Input({ required: true }) invoices!: SingleInVoiceModel;
}
