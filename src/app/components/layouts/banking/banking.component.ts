import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-banking',
  standalone: true,
  templateUrl: './banking.component.html',
  styleUrl: './banking.component.scss',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class BankingComponent {
  constructor() {
    console.log('BankingComponent créé !');
  }
}
