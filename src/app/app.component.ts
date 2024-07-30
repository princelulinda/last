import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { DbService } from './core/db/db.service';
import { AuthService, ConfigService, DialogService } from './core/services';
import { ConfirmDialogComponent } from './global/components/popups/confirm-dialog/confirm-dialog.component';
import { SplashScreenComponent } from './layouts/splash-screen/splash-screen.component';
import {
  ModeModel,
  PlateformModel,
} from './core/services/config/main-config.models';
import { environment } from '../environments/environment';
import { TransferBillComponent } from './global/components/popups/bills-format/transfer-bill/transfer-bill.component';
import { LandscapeBillComponent } from './global/components/popups/bills-format/landscape-bill/landscape-bill.component';
import { ObrBillComponent } from './global/components/popups/bills-format/obr-bill/obr-bill.component';
import { MerchantBillComponent } from './global/components/popups/bills-format/merchant-bill/merchant-bill.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    ConfirmDialogComponent,
    SplashScreenComponent,
    TransferBillComponent,
    LandscapeBillComponent,
    ObrBillComponent,
    MerchantBillComponent,
  ],
})
export class AppComponent implements OnInit {
  plateform: PlateformModel = 'authentification';
  plateform$: Observable<PlateformModel>;
  activeMode!: ModeModel;
  activeMode$: Observable<ModeModel>;
  mainBackground = 'bg-ihela';

  constructor(
    private dbService: DbService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.plateform$ = this.configService.getPlateform();
    this.activeMode$ = this.configService.getMode();
  }

  ngOnInit() {
    const localToken = this.authService.getLocalAuthToken();
    if (localToken) {
      this.dialogService.dispatchSplashScreen();
      this.dbService.dbIsReady.subscribe(() => {
        this.dialogService.closeSplashScreen();
      });
    }

    this.dbService.initializeModels();
    this.configService.initAll();
    // this.configService.initPopulate();

    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
        const plateformData = environment.plateformsUuid.filter(
          plateformData => plateformData.name === plateform
        )[0];
        this.mainBackground = `bg-${plateformData.theme.name}`;
      },
    });
    this.activeMode$.subscribe({
      next: mode => {
        this.activeMode = mode;
      },
    });

    this.dialogService.OpenTransfertBillPopup({
      amount: '123',
      bank_reference: '',
      bill_date: new Date(Date.now()),
      credit_account: 'adada',
      credit_account_holder: '',
      credit_bank: '',
      debit_account: '',
      debit_account_holder: '',
      debit_bank: '',
      description: 'asdad',
      reference: 'adad',
      transfer_fees: 'adad',
    });

    // TODO :: TRY TO CHANGE PLATEFORM BY URL !! CAN GOT PROBLEME WITH SOME GUARDS
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe({
    //     next: events => {
    //       let navigationInfo: NavigationEnd = events as NavigationEnd;
    //     },
    //   });
  }

  // private managePlateformByURL() {
  //   let url = this.router.url;
  //   let plateformData = environment.plateformsUuid.find(item =>
  //     item.baseHref.includes(url)
  //   );
  //   if (
  //     plateformData &&
  //     plateformData.name !== this.mainConfig.activePlateform
  //   ) {
  //     this.configService.switchPlateform(plateformData?.name);
  //   }
  // }
}
