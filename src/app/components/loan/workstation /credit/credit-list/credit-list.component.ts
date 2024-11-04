import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-credit-list',
  standalone: true,
  imports: [],
  templateUrl: './credit-list.component.html',
  styleUrl: './credit-list.component.scss',
})
export class CreditListComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
