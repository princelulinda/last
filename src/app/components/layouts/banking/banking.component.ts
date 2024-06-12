import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banking',
  standalone: true,
  templateUrl: './banking.component.html',
  styleUrl: './banking.component.scss',
  imports: [RouterModule],
})
export class BankingComponent {
  constructor() {
    console.log('BankingComponent créé !');
  }
}
