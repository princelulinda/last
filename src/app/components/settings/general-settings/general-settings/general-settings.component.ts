import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit {
  clientInfo!: UserInfoModel;

  private userInfo$: Observable<UserInfoModel>;

  constructor(private authService: AuthService) {
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo) {
          this.clientInfo = userinfo;
          console.log('userinfo', this.clientInfo);
        }
      },
    });
  }
}
