import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsideBarComponent } from './aside-bar/aside-bar.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { LoginComponent } from '../../auth/login/login.component';

@Component({
  selector: 'app-banking',
  standalone: true,
  templateUrl: './banking.component.html',
  styleUrl: './banking.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsideBarComponent,
    AsideMenuComponent,
    LoginComponent,
  ],
})
export class BankingComponent {
  constructor() {
    console.log('BankingComponent créé !');
  }
}
