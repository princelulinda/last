import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, ConfigService } from '../../../core/services';
import { MenuService } from '../../../core/services/menu/menu.service';
import {
  activeMainConfigModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { UserInfoModel } from '../../../core/db/models/auth';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;

  constructor(
    private configService: ConfigService,
    private menuService: MenuService,
    private authService: AuthService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    this.userInfo$.subscribe({
      next: userInfo => {
        this.userInfo = userInfo;
      },
    });
  }

  hideAsideMenu() {
    this.menuService.toggleAsideMenu(true);
  }

  switchPlateform(plateform: PlateformModel) {
    this.configService.switchPlateform(plateform);
  }
}
