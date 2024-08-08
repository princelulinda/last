import { Component, Input } from '@angular/core';
import { BillersModel } from '../../dashboards/dashboard.model';

@Component({
  selector: 'app-biller-card',
  standalone: true,
  imports: [],
  templateUrl: './biller-card.component.html',
  styleUrl: './biller-card.component.scss',
})
export class BillerCardComponent {
  @Input() billers: BillersModel[] = [];
}
