import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loan-simulator',
  standalone: true,
  imports: [],
  templateUrl: './loan-simulator.component.html',
  styleUrl: './loan-simulator.component.scss',
})
export class LoanSimulatorComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
