import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { SwitchPlateformIconsComponent } from './switch-plateform-icons/switch-plateform-icons.component';
import {
  ConfigService,
  PlateformModel,
  activeMainConfigModel,
} from '../../../core/services';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface organizationModel {
  company_type_code: string;
  institution_client: {
    client_full_name: string;
    picture: string;
  };
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SwitchPlateformIconsComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  // public variableService = inject(VariableService);
  // public themeService = inject(ThemeService);
  // showMenu = false;

  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  // organization$!: Observable<organizationModel>;
  organization!: organizationModel;

  // showUserInfo = false;
  // userInfo$: Observable<any>;

  // eslint-disable-next-line
  userInfo: any;

  // corporates$: Observable<any>;

  // eslint-disable-next-line
  corporates: any;
  showCorporatesSection = false;
  // dialog$: Observable<any>;
  dialog = '';

  // eslint-disable-next-line
  selectedCorporate: any;
  // operator$: Observable<any>;
  operator = '';
  otherCorporates = '';
  selectedLanguage = new FormControl('fr');
  next = '';
  themeLogo = '';
  showPlateformPopup = false;
  // clientInfo$: Observable<any>;

  // eslint-disable-next-line
  clientInfo: any;

  @Output() toggleAsideMenuEvent = new EventEmitter<boolean>();
  asideMenuIsActive = false;

  chatNotFoundPopup = false;
  notificationNotFoundPopup = false;
  lightModeImage = '';

  gridFill = '';
  onlineBankingHeaderImage = '';
  //eyeShowed was any
  eyeShowed!: [];
  // eyeStatus$: Observable<any>;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    this.next = $localize`next`;
    // this.theme = $localize`theme`;

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });

    // if (this.generalService.isCurrentDateInChristMassPeriod()) {
    //     this.onlineBankingHeaderImage =
    //         '../../../assets/images/ihela_christmas.png';
    // } else {
    //     this.onlineBankingHeaderImage = '../../../assets/images/ihela3.png';
    // }

    // this.eyeStatus$.subscribe({
    //     next: (status) => {
    //         this.eyeShowed = status;
    //     },
    // });

    // this.organization$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (organization) => {
    //         this.corporates$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //             next: (corporates) => {
    //                 this.corporates = [];
    //                 this.organization = organization;
    //                 this.corporates = [];
    //                 if (this.organization) {
    //                     for (let i = 0; i < corporates.length; i++) {
    //                         if (
    //                             corporates[i].organization
    //                                 .institution_client.client_full_name !==
    //                             this.organization.institution_client
    //                                 .client_full_name
    //                         ) {
    //                             this.corporates.push(corporates[i]);
    //                         }
    //                     }
    //                 }
    //             },
    //         });
    //     },
    // });

    // this.userInfo$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (userInfo) => {
    //         this.userInfo = userInfo;
    //     },
    // });

    // this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (theme: any) => {
    //         this.theme = theme;
    //         if (
    //             this.theme === 'magis-light' ||
    //             this.theme === 'light-mode'
    //         ) {
    //             this.themeLogo = '/assets/images/light-active.svg';
    //         } else if (
    //             this.theme === 'magis-dark' ||
    //             this.theme === 'dark-mode'
    //         ) {
    //             this.themeLogo = '/assets/images/dark-active.svg';
    //         }
    //     },
    // });

    // this.menuService.getAsideMenuStatus$
    //     .pipe(takeUntil(this.onDestroy$))
    //     .subscribe((value) => {
    //         this.asideMenuIsActive = value;
    //     });

    // this.operator$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (operator) => {
    //         this.operator = operator;
    //     },
    // });
    // this.clientInfo$.subscribe({
    //     next: (clientInfo) => {
    //         this.clientInfo = clientInfo;
    //     },
    // });

    // this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
    //     next: (dialog) => {
    //         this.dialog = dialog;
    //         if (this.dialog && this.dialog.response) {
    //             if (
    //                 this.dialog.response === 'Yes' &&
    //                 this.dialog.action === 'logoutCorporate'
    //             ) {
    //                 this.store.dispatch(new LogoutCorporate());
    //                 // this.store.dispatch))
    //             } else if (this.dialog.response === 'No') {
    //                 // console.log('Mugumize aho');
    //                 // this.showSettingMenu = false;
    //             } else if (
    //                 this.dialog.response === 'password submitted' &&
    //                 this.dialog.action === 'switch corporate'
    //             ) {
    //                 this.loginCorporate();
    //             }
    //         }
    //     },
    // });
  }

  // eye amount keyshortcuts
  @HostListener('window:keyup.control.shift.v', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.toggleEyeStatus();
    console.log(event);
  }

  // doShowMenu() {
  //   if (this.showMenu) {
  //     this.showMenu = false;
  //   } else {
  //     this.showMenu = true;
  //   }
  // }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // getOtherCorporates(corporate:any){
  //     this.otherCorporates=corporate.
  // }

  // showPlateformMenu() {
  //   if (this.showMenu) {
  //     this.showMenu = false;
  //   } else {
  //     this.showMenu = true;
  //     this.showUserInfo = false;
  //     this.chatNotFoundPopup = false;
  //     this.notificationNotFoundPopup = false;
  //     this.showPlateformPopup = false;
  //   }
  // }

  // showPlateform() {
  //   if (this.showPlateformPopup) {
  //     this.showPlateformPopup = false;
  //   } else {
  //     this.showPlateformPopup = true;
  //     this.showMenu = false;
  //     this.showUserInfo = false;
  //     this.chatNotFoundPopup = false;
  //     this.notificationNotFoundPopup = false;
  //   }
  // }

  // displayUserInfo() {
  //   if (this.showUserInfo) {
  //     this.showUserInfo = false;
  //   } else {
  //     this.showUserInfo = true;
  //     this.chatNotFoundPopup = false;
  //     this.notificationNotFoundPopup = false;
  //     this.showMenu = false;
  //     this.showPlateformPopup = false;
  //   }
  // }

  toggleMarket() {
    // this.store.dispatch(new SelectMarket({ marketName: 'market' }));
  }

  switchMode() {
    this.configService.switchMode();
  }
  switchPlateform(plateform: PlateformModel) {
    this.configService.switchPlateform(plateform);
  }

  // logout() {
  //     this.store.dispatch(new Logout());
  // }

  // displayCorporatesSection() {
  //   if (this.showCorporatesSection) {
  //     this.showCorporatesSection = false;
  //   } else {
  //     this.showCorporatesSection = true;
  //   }
  // }

  // openModal() {
  //   const data = {
  //     title: '',
  //     type: 'confirm',
  //     message:
  //       'This action will disconnect you in ' +
  //       this.organization.institution_client.client_full_name +
  //       '  Are you sure you want to Logout ?',
  //     action: 'logoutCorporate',
  //   };
  //   // this.store.dispatch(new OpenConfirmDialog(data));
  //   // this.showSettingMenu = true;
  // }
  //corporate was any
  // eslint-disable-next-line
  switchCorporate(corporate: any) {
    this.selectedCorporate = corporate;
    const data = {
      title: '',
      type: 'password',
      message:
        'Login in ' +
        this.selectedCorporate.organization.institution_client.client_full_name,
      action: 'switch corporate',
    };
    console.log('the openAction data:' + data);
    // this.store.dispatch(new OpenActionDialog(data));
  }

  loginCorporate() {
    const data = {
      title: '',
      type: 'loading',
      message: '',
    };
    console.log('the data:' + data);
    // this.store.dispatch(new OpenDialog(data));
    // this.authService
    //   .logoutCorporate()
    //   .pipe(takeUntil(this.onDestroy$))
    //   .subscribe({
    // next: (data) => {
    //     // if (data.object.success === true) {
    //     //     const login_data = {
    //     //         password: this.variableService.password,
    //     //         organization_id:
    //     //             this.selectedCorporate.organization.id,
    //     //     };
    //     //     this.authService.loginCorporate(login_data).subscribe({
    //     //         next: (data) => {
    //     //             this.store.dispatch(
    //     //                 new CloseDialog({ response: 'close' })
    //     //             );
    //     //             this.variableService.password = '';
    //     //             if (data.object.success === true) {
    //     //                 window.location.href = '/w';
    //     //             } else if (data.object.response_code === '07') {
    //     //                 this.displayCorporatesSection();
    //     //                 const dataModal = {
    //     //                     title: '',
    //     //                     type: 'failed',
    //     //                     message: data.object.response_message,
    //     //                 };
    //     //                 this.store.dispatch(
    //     //                     new OpenDialog(dataModal)
    //     //                 );
    //     //             }
    //     //         },
    //     //         error: (err) => {
    //     //             console.log('errrrrss', err);
    //     //             this.variableService.password = '';
    //     //             // this.showPassword = true;
    //     //             // this.isLoading = false;
    //     //             const data = {
    //     //                 title: '',
    //     //                 type: 'failed',
    //     //                 message: 'Could not Login',
    //     //             };
    //     //             this.store.dispatch(new OpenDialog(data));
    //     //         },
    //     //     });
    //     // }
    // },
    // });
    // this.store.dispatch( new LogoutCorporate({ corporateOnly: true }));
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

  toggleAsideMenu() {
    // this.menuService.toggleAsideMenu(hidden);
  }

  // toggleNotFoundPopup(action: string) {
  //   switch (action) {
  //     case 'notification':
  //       if (this.notificationNotFoundPopup) {
  //         this.notificationNotFoundPopup = false;
  //       } else {
  //         this.notificationNotFoundPopup = true;
  //         this.showMenu = false;
  //         this.showUserInfo = false;
  //         this.chatNotFoundPopup = false;
  //         this.showPlateformPopup = false;
  //       }
  //       break;
  //     case 'chat':
  //       if (this.chatNotFoundPopup) {
  //         this.chatNotFoundPopup = false;
  //       } else {
  //         this.chatNotFoundPopup = true;
  //         this.showMenu = false;
  //         this.showUserInfo = false;
  //         this.notificationNotFoundPopup = false;
  //         this.showPlateformPopup = false;
  //       }
  //       break;
  //   }
  // }

  // Get close event from not-found-page
  // getPopupEvent(event: any) {
  //     console.log('event', event);

  //     //Ensure that we close the right popup, the one that is currently open
  //     if (this.notificationNotFoundPopup) {
  //         this.notificationNotFoundPopup = event;
  //     }

  //     if (this.chatNotFoundPopup) {
  //         this.chatNotFoundPopup = event;
  //     }
  // }

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
    // this.store.dispatch(new displayAmount({ show: !this.eyeShowed }));
  }
}
