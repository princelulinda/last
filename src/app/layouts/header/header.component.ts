import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Observable, Subject, takeUntil } from 'rxjs';

import { AuthService, ConfigService } from '../../core/services';
import { UserInfoModel } from '../../core/db/models/auth';
import { SwitchPlateformIconsComponent } from './switch-plateform-icons/switch-plateform-icons.component';
import {
  activeMainConfigModel,
  ModeModel,
  PlateformModel,
} from '../../core/services/config/main-config.models';
import { FooterComponent } from '../footer/footer.component';
import { SwitchModeComponent } from '../../global/components/switch-mode/switch-mode.component';
import { ProfileCardComponent } from '../../global/components/custom-field/profile-card/profile-card.component';
import { DialogService } from '../../core/services';
import { OrganizationModel } from '../../components/auth/auth.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    SwitchPlateformIconsComponent,
    FooterComponent,
    SwitchModeComponent,
    ProfileCardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  theme$: Observable<ModeModel>;
  theme!: ModeModel;

  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  organization$!: Observable<OrganizationModel | null>;
  organization!: OrganizationModel | null;

  userInfo!: UserInfoModel | null;
  userInfo$: Observable<UserInfoModel>;

  amountState = false;
  amountState$: Observable<boolean>;

  selectedLanguage = new FormControl('fr');

  showPlateformPopup = false;
  showUserInfoPopup = false;

  menuRouterLink = '';

  constructor(
    private dialogService: DialogService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
    this.theme$ = this.configService.getMode();
    this.organization$ = this.configService.getSelectedOrganization();
    this.amountState$ = this.dialogService.getAmountState();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });

    this.mainConfig$.subscribe({
      next: configs => {
        if (configs) {
          this.mainConfig = configs;
          if (this.mainConfig.activePlateform === 'newsFeed') {
            this.menuRouterLink = '/n/banking_menu';
          } else if (this.mainConfig.activePlateform === 'onlineBanking') {
            this.menuRouterLink = '/b/banking_menu';
          } else if (
            this.mainConfig.activePlateform === 'marketPlace' ||
            this.mainConfig.activePlateform === 'myMarket'
          ) {
            this.menuRouterLink = '/m/banking_menu';
          } else if (this.mainConfig.activePlateform === 'bankingSettings') {
            this.menuRouterLink = '/b/settings_menu';
          }
        }
      },
    });

    this.userInfo$.subscribe({
      next: user => {
        if (user) {
          this.userInfo = user;
        }
      },
    });

    this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: org => {
        this.organization = org;
      },
    });
    this.amountState$.subscribe({
      next: state => {
        this.amountState = state;
      },
    });
  }

  // eye amount keyshortcuts
  @HostListener('window:keyup.control.shift.v', ['$event'])
  handleKeyDown() {
    this.toggleEyeStatus();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  switchMode() {
    this.configService.switchMode();
  }
  switchPlateform(plateform: PlateformModel) {
    this.configService.switchPlateform(plateform);
  }

  logout() {
    this.authService.logout();
  }

  changeLanguage() {
    const url = window.location.href; // get current url
    const a = document.createElement('a'); // create an a element
    a.href = url; // set its href to the URL
    const paths = a.pathname.split('/'); // split the pathname by /
    paths.shift(); // remove the first empty element
    console.log('pathsssss', paths);
    if (paths[0].length == 2) {
      paths[0] = this.selectedLanguage.value!; // replace it with the new one
      const new_url =
        a.protocol +
        '//' +
        a.host +
        '/' +
        paths.join('/') +
        (a.search != '' ? a.search : '') +
        (a.hash != '' ? a.hash : '');
      window.location.href = new_url;
    }
  }

  isCurrentDateInChristMassPeriod() {
    // Get the current date
    const currentDate = new Date();
    // Get the month and date of the current date
    const currentMonth = currentDate.getMonth(); // 0 for January, 11 for December
    const currentDateDate = currentDate.getDate();
    // Check if the current date is between 15 December and 5 January
    return (
      (currentMonth == 11 && currentDateDate >= 15) ||
      (currentMonth == 0 && currentDateDate <= 5)
    );
  }

  toggleEyeStatus() {
    this.dialogService.displayAmount();
  }
  toggleUserInfo() {
    this.showUserInfoPopup = !this.showUserInfoPopup;
    this.showPlateformPopup = false;
  }
  togglePlateformIconsPopup() {
    this.showPlateformPopup = !this.showPlateformPopup;
    this.showUserInfoPopup = false;
  }
}
