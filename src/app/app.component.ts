import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { DbService } from './core/db/db.service';
import {
  ConfigService,
  PlateformModel,
  activeMainConfigModel,
} from './core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  mainConfig: activeMainConfigModel | undefined;
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
    switch (plateform) {
      case 'workstation':
        this.navigate('/w');
        break;
      case 'newsFeed':
        this.navigate('/n');
        break;
      case 'onlineBanking':
        this.navigate('/b');
        break;
      case 'onamob':
        this.navigate('/o');
        break;
      case 'marketPlace':
        this.navigate('/m');
        break;
      case 'admin':
        this.navigate('/a');
        break;
      default:
        this.navigate('/n');
        break;
    }
  }

  private navigate(url: string) {
    this.router.navigate([url]);
  }
}
