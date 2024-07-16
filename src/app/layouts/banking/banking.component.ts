import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';

import { AsideBarComponent } from './aside-bar/aside-bar.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { SubHeaderComponent } from '../header/sub-header/sub-header.component';
import { HeaderComponent } from '../header/header.component';
import { SwitchPlateformIconsComponent } from '../header/switch-plateform-icons/switch-plateform-icons.component';
import {
  AuthService,
  ConfigService,
  DialogService,
  PlateformModel,
} from '../../core/services';
import { SettingsAsideMenuComponent } from './settings/settings-aside-menu/settings-aside-menu.component';
import { DbService } from '../../core/db';
import { UserInfoModel } from '../../core/db/models/auth';

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

  localToken: string | null;
  localClientId: string | null = null;
  dbUser: Promise<UserInfoModel | null>;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private dbService: DbService,
    private dialogService: DialogService
  ) {
    this.plateform$ = this.configService.getPlateform();
    this.localToken = this.authService.getLocalAuthToken();
    this.localClientId = this.authService.getLocalClientId();
    this.dbUser = this.dbService.getDbUser();
  }

  ngOnInit() {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
  }

  // populate() {
  //   this.dialogService.dispatchSplashScreen();
  //   this.authService.populateClient().subscribe({
  //     next: (data: { object: UserInfoModel }) => {
  //       const populateData = data.object;
  //       console.log('TODO :: POPULATE USER DATA', populateData);
  //       const userInfo: UserInfoModel = {
  //         user: {
  //           username: populateData.user.username,
  //           token: populateData.user.token,
  //           fcm_data: {},
  //           device_data: {},
  //         },
  //         client: {
  //           id: populateData.client.id,
  //           client_id: populateData.client.client_id,
  //           client_code: populateData.client.client_code,
  //           client_email: populateData.client.client_email,
  //           client_full_name: populateData.client.client_full_name,
  //           client_phone_number: populateData.client.client_phone_number,
  //           client_type: populateData.client.client_type,
  //           has_pin: populateData.client.has_pin,
  //           is_agent: populateData.client.is_agent,
  //           is_merchant: populateData.client.is_merchant,
  //           is_partner_bank: populateData.client.is_partner_bank,
  //           picture_url: populateData.client.picture_url,
  //           prefered_language: populateData.client.prefered_language,
  //         },
  //       };
  //       this.dbService.setUser(userInfo);
  //       this.dialogService.closeSplashScreen();
  //     },
  //     error: err => {
  //       console.log(err);
  //     },
  //   });
  // }
}
