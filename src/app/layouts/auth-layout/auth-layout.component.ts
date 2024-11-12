import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd,
  Router,
} from '@angular/router';
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { ResetPasswordComponent } from '../../components/auth/reset-password/reset-password.component';
import { FooterComponent } from '../footer/footer.component';
import { UserInfoModel } from '../../core/db/models/auth';
import { Observable } from 'rxjs';
import { DbService } from '../../core/db';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    ResetPasswordComponent,
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FooterComponent,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements OnInit {
  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;

  login = true;

  constructor(
    private authService: AuthService,
    private dbService: DbService,
    private router: Router
  ) {
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.userInfo$.subscribe({
      next: userInfo => {
        if (userInfo) {
          this.dbService.setLocalStorageClientId(
            userInfo.client?.client_id.toString()
          );
        }
      },
    });

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
