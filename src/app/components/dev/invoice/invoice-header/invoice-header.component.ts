import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvoiceGroupModel } from '../invoice.models';

@Component({
  selector: 'app-invoice-header',
  standalone: true,
  imports: [],
  templateUrl: './invoice-header.component.html',
  styleUrl: './invoice-header.component.scss',
})
export class InvoiceHeaderComponent {
  @Input() group_name!: InvoiceGroupModel;
  @Output() goBackEvent = new EventEmitter<boolean>();

  goBack() {
    const isSelected_group = false;
    this.goBackEvent.emit(isSelected_group);
  }
}
