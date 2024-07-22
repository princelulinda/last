import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { AuthService, ConfigService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { userInfoModel } from '../model';
import { CommonModule } from '@angular/common';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-sub-header',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss',
})
export class SubHeaderComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  dayMoment = 'Morning';
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  private userInfo$: Observable<UserInfoModel>;

  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
      },
    });
    this.dayMoment = this.timeOfDay();

    setInterval(() => {
      this.dayMoment = this.timeOfDay();
    }, 60000);
  }

  timeOfDay() {
    let moment = '';
    const hour = new Date().getHours();
    if (hour >= 4 && hour <= 11) {
      moment = 'Morning';
    } else if (hour >= 12 && hour <= 16) {
      moment = 'Afternoon';
    } else if (hour >= 17 || hour <= 3) {
      moment = 'Evening';
    }
    return moment;
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
