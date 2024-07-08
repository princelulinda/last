import { Component, OnInit } from '@angular/core';
import {
  // NavigationEnd,
  RouterOutlet,
} from '@angular/router';

import { Observable } from 'rxjs';

import { DbService } from './core/db/db.service';
import {
  ConfigService,
  // PlateformModel,
  activeMainConfigModel,
} from './core/services';
import { ConfirmDialogComponent } from './global/components/popups/confirm-dialog/confirm-dialog.component';
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
    private configService: ConfigService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.dbService.dbIsReady.subscribe((value: boolean) =>
      console.log(`APP COMPONENT DB READY : ${value}`)
    );
  }

  ngOnInit() {
    this.dbService.initializeModels();
    this.configService.initAll();
    // this.configService.initPopulate();

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
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
