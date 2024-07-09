import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-loan-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './loan-home.component.html',
  styleUrl: './loan-home.component.scss',
})
export class LoanHomeComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
