import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '../../../../core/services';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { ProfileCardComponent } from '../../../../global/components/custom-field/profile-card/profile-card.component';

@Component({
  selector: 'app-onamob-dashboard',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './onamob-dashboard.component.html',
  styleUrl: './onamob-dashboard.component.scss',
})
export class OnamobDashboardComponent implements OnInit {
  numbers = [1, 2, 3, 4];

  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;

  constructor(private authService: AuthService) {
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.userInfo$.subscribe({
      next: user => {
        this.userInfo = user;
      },
    });
  }
}
