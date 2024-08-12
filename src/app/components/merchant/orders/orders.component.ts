import { Component } from '@angular/core';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NotFoundPageComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {}
