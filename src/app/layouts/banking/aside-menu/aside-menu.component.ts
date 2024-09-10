import { Location, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';

import { AuthService, ConfigService } from '../../../core/services';
import { MenuService } from '../../../core/services/menu/menu.service';
import {
  activeMainConfigModel,
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { UserInfoModel } from '../../../core/db/models/auth';
import { BankModel } from '../../../core/db/models/bank/bank.model';

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
  selectedBank!: BankModel;
  selectedBank$!: Observable<BankModel>;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(
    private configService: ConfigService,
    private menuService: MenuService,
    private authService: AuthService,
    private _location: Location
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
    this.selectedBank$ = this.configService.getSelectedBank();
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    this.userInfo$.subscribe({
      next: userInfo => {
        if (userInfo) {
          this.userInfo = userInfo;
        }
      },
    });

    this.selectedBank$.subscribe({
      next: bank => {
        this.selectedBank = bank;
      },
    });
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
  }

  hideAsideMenu() {
    // TODO :: TO IMPLEMENT RESPONSIVE OF ASIDE MENU
    console.log('HIDE ASIDE MENU ON MOBILE DEVICE');
  }

  switchPlateform(plateform: PlateformModel) {
    this.configService.switchPlateform(plateform, false);
  }

  goBack() {
    this._location.back();
  }
}
