import { Component, OnInit } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';

import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [AuthHeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements OnInit {
  login = true;

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url === '/login') {
      this.login = false;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.login = false;
        } else {
          this.login = true;
        }
      }
    });
  }
}
