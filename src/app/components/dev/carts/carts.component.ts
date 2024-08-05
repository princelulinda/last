import { Component } from '@angular/core';
import { NotFoundPageComponent } from '../../../global/components/empty-states/not-found-page/not-found-page.component';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [NotFoundPageComponent],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.scss',
})
export class CartsComponent {}
