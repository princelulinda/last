import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loan-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './loan-home.component.html',
  styleUrl: './loan-home.component.scss',
})
export class LoanHomeComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
