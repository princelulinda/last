import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [],
  templateUrl: './loan-request.component.html',
  styleUrl: './loan-request.component.scss',
})
export class LoanRequestComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
