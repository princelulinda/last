import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';

import { AsideBarComponent } from './aside-bar/aside-bar.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { SubHeaderComponent } from '../header/sub-header/sub-header.component';
import { HeaderComponent } from '../header/header.component';
import { SwitchPlateformIconsComponent } from '../header/switch-plateform-icons/switch-plateform-icons.component';
import { AuthService, ConfigService } from '../../core/services';
import { SettingsAsideMenuComponent } from './settings/settings-aside-menu/settings-aside-menu.component';
import { PlateformModel } from '../../core/services/config/main-config.models';
import { UserInfoModel } from '../../core/db/models/auth';
import { DbService } from '../../core/db';

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
    HeaderComponent,
    SwitchPlateformIconsComponent,
    SubHeaderComponent,
    SettingsAsideMenuComponent,
  ],
})
export class BankingComponent implements OnInit {
  plateform: PlateformModel = 'newsFeed';
  plateform$: Observable<PlateformModel>;

  userInfo!: UserInfoModel;
  userInfo$: Observable<UserInfoModel>;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private dbService: DbService
  ) {
    this.plateform$ = this.configService.getPlateform();
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
    this.userInfo$.subscribe({
      next: userInfo => {
        if (userInfo) {
          this.dbService.setLocalStorageClientId(
            userInfo?.client?.client_id.toString()
          );
        }
      },
    });
  }
}
