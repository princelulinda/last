import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden-403',
  standalone: true,
  imports: [],
  templateUrl: './forbidden-403.component.html',
  styleUrl: './forbidden-403.component.scss',
})
export class Forbidden403Component {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
