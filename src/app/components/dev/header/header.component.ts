import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private onDestroy$: Subject<void> = new Subject<void>();
    // public variableService = inject(VariableService);
    // public themeService = inject(ThemeService);
    showMenu = false;
    @Input() onLoginPage = false;
    plateform$: any;
    plateform = '';
    // organization$: Observable<any>;
    organization: any;
    showUserInfo = false;
    userInfo$!: Observable<any>;
    userInfo: any;
    theme$!: Observable<any>;
    theme = '';
    corporates$!: Observable<any>;
    corporates: any[] = [];
    showCorporatesSection = false;
    dialog$!: Observable<any>;
    dialog: any;
    selectedCorporate: any;
    operator$!: Observable<any>;
    operator: any;
    otherCorporates: any;
    selectedLanguage = new FormControl('fr');
    next = '';
    themeLogo = '';
    showPlateformPopup = false;
    clientInfo$!: Observable<any>;

    clientInfo: any;


    @Output() toggleAsideMenuEvent: any = new EventEmitter<boolean>();
    asideMenuIsActive = false;

    chatNotFoundPopup = false;
    notificationNotFoundPopup = false;
    lightModeImage = '';

    gridFill = '';
    onlineBankingHeaderImage = '';

    eyeShowed: any;
    eyeStatus$!: Observable<any>;

    ngOnInit(): void {
      this.next = $localize`next`;
      this.theme = $localize`theme`;

      

      this.eyeStatus$.subscribe({
          next: (status) => {
              this.eyeShowed = status;
          },
      });

      

      this.userInfo$.pipe(takeUntil(this.onDestroy$)).subscribe({
          next: (userInfo) => {
              this.userInfo = userInfo;
          },
      });

      this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
          next: (theme: any) => {
              this.theme = theme;
              if (
                  this.theme === 'magis-light' ||
                  this.theme === 'light-mode'
              ) {
                  this.themeLogo = '/assets/images/light-active.svg';
              } else if (
                  this.theme === 'magis-dark' ||
                  this.theme === 'dark-mode'
              ) {
                  this.themeLogo = '/assets/images/dark-active.svg';
              }
          },
      });

      // this.menuService.getAsideMenuStatus$
      //     .pipe(takeUntil(this.onDestroy$))
      //     .subscribe((value) => {
      //         this.asideMenuIsActive = value;
      //     });

      this.operator$.pipe(takeUntil(this.onDestroy$)).subscribe({
          next: (operator) => {
              this.operator = operator;
          },
      });
      this.clientInfo$.subscribe({
          next: (clientInfo) => {
              this.clientInfo = clientInfo;
          },
      });

      
  }


    // eye amount keyshortcuts
    @HostListener('window:keyup.control.shift.v', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.toggleEyeStatus();
    }

    doShowMenu() {
        if (this.showMenu) {
            this.showMenu = false;
        } else {
            this.showMenu = true;
        }
    }

    public ngOnDestroy(): void {
      this.onDestroy$.next();
      this.onDestroy$.complete();
  }

  showPlateformMenu() {
    if (this.showMenu) {
        this.showMenu = false;
    } else {
        this.showMenu = true;
        this.showUserInfo = false;
        this.chatNotFoundPopup = false;
        this.notificationNotFoundPopup = false;
        this.showPlateformPopup = false;
    }
}

showPlateform() {
  if (this.showPlateformPopup) {
      this.showPlateformPopup = false;
  } else {
      this.showPlateformPopup = true;
      this.showMenu = false;
      this.showUserInfo = false;
      this.chatNotFoundPopup = false;
      this.notificationNotFoundPopup = false;
  }
}

isplayUserInfo() {
  if (this.showUserInfo) {
      this.showUserInfo = false;
  } else {
      this.showUserInfo = true;
      this.chatNotFoundPopup = false;
      this.notificationNotFoundPopup = false;
      this.showMenu = false;
      this.showPlateformPopup = false;
  }
}

// switchPlateform(plateform: string) {
//   if (this.plateform !== plateform) {
//       if (plateform === 'onamob') {
//           if (
//               this.theme === 'light-mode' ||
//               this.theme === 'magis-light'
//           ) {
//               this.themeService.switchPlateform(
//                   plateform,
//                   'light-mode',
//                   this.organization
//               );
//           }
//           if (this.theme === 'dark-mode' || this.theme === 'magis-dark') {
//               this.themeService.switchPlateform(
//                   plateform,
//                   'dark-mode',
//                   this.organization
//               );
//           }
//       } else if (plateform !== 'onamob') {
//           this.themeService.switchPlateform(
//               plateform,
//               this.theme,
//               this.organization
//           );
//       }

//       if (plateform === 'market') {
//           this.toggleMarket();
//       }
//   }
// }


    displayCorporatesSection() {
        if (this.showCorporatesSection) {
            this.showCorporatesSection = false;
        } else {
            this.showCorporatesSection = true;
        }
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

//   toggleAsideMenu(hidden?: boolean) {
//     this.menuService.toggleAsideMenu(hidden);
// }

toggleNotFoundPopup(action: string) {
  switch (action) {
      case 'notification':
          if (this.notificationNotFoundPopup) {
              this.notificationNotFoundPopup = false;
          } else {
              this.notificationNotFoundPopup = true;
              this.showMenu = false;
              this.showUserInfo = false;
              this.chatNotFoundPopup = false;
              this.showPlateformPopup = false;
          }
          break;
      case 'chat':
          if (this.chatNotFoundPopup) {
              this.chatNotFoundPopup = false;
          } else {
              this.chatNotFoundPopup = true;
              this.showMenu = false;
              this.showUserInfo = false;
              this.notificationNotFoundPopup = false;
              this.showPlateformPopup = false;
          }
          break;
  }
}

   // Get close event from not-found-page
   getPopupEvent(event: any) {
    console.log('event', event);

    //Ensure that we close the right popup, the one that is currently open
    if (this.notificationNotFoundPopup) {
        this.notificationNotFoundPopup = event;
    }

    if (this.chatNotFoundPopup) {
        this.chatNotFoundPopup = event;
    }
}

}
