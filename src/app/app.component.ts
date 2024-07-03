import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';

import { DbService } from './core/db/db.service';
import {
  ConfigService,
  DialogService,
  PlateformModel,
  activeMainConfigModel,
} from './core/services';
import { ConfirmDialogComponent } from './global/popups/confirm-dialog/confirm-dialog.component';
import { DialogResponseModel } from './core/services/dialog/dialogs-models';

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

  dialog$: Observable<DialogResponseModel>;

  constructor(
    private dbService: DbService,
    private configService: ConfigService,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.dbService.dbIsReady.subscribe((value: boolean) =>
      console.log(`APP COMPONENT DB READY : ${value}`)
    );
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    this.dialogService.openDialog({
      action: 'Generate bill password',
      message: '',
      title: '',
      type: 'pin',
    });

    this.dialog$.subscribe({
      next: dialog => {
        console.log('TODO ::', dialog);
      },
    });
    this.dbService.initializeModels();
    this.configService.initAll();

    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
        // this.managePlateformRedirection(this.mainConfig.activePlateform);
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
