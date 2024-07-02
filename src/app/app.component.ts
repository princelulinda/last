import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, RouterOutlet } from '@angular/router';

import { DbService } from './core/db/db.service';
import {
  ConfigService,
  PlateformModel,
  activeMainConfigModel,
} from './core/services';
import { ConfirmDialogComponent } from './global/popups/confirm-dialog/confirm-dialog.component';
// import { OpenDialog } from './core/popups/dialogs/open-dialog';
// import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ConfirmDialogComponent],
})
export class AppComponent implements OnInit {
  mainConfig!: activeMainConfigModel;
  mainConfig$: Observable<activeMainConfigModel>;

  constructor(
    private dbService: DbService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.dbService.dbIsReady.subscribe((value: boolean) =>
      console.log(`APP COMPONENT DB READY : ${value}`)
    );
  }

  ngOnInit() {
    // let response = new OpenDialog({
    //   message: 'Vous voulez confirmer cette action',
    //   title: '',
    //   type: 'confirm',
    //   action: 'Get Confirmation',
    // }).getResponse();
    console.log('INITIALIZING DB VARS FROM APP COMPONENT');
    this.dbService.initializeModels();
    this.configService.initAll();

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
        this.managePlateformRedirection(this.mainConfig.activePlateform);
      },
    });
  }

  private managePlateformRedirection(plateform: PlateformModel) {
    const plateformData = this.configService.filterPlatformData(plateform);
    this.router.navigate([plateformData.baseHref]);
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
