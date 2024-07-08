import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found-404',
  standalone: true,
  imports: [],
  templateUrl: './not-found-404.component.html',
  styleUrl: './not-found-404.component.scss',
})
export class NotFound404Component {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
