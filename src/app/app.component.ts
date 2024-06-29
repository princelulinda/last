import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { DbService } from './core/db/db.service';
import {
  ConfigService,
  PlateformModel,
  activeMainConfigModel,
} from './core/services';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './global/popups/confirm-dialog/confirm-dialog.component';
import { OpenDialog } from './core/popups/dialogs/open-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ConfirmDialogComponent],
})
export class AppComponent implements OnInit {
  mainConfig: activeMainConfigModel | undefined;
  mainConfig$: Observable<activeMainConfigModel>;

  constructor(
    private dbService: DbService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.dbService.dbIsReady.subscribe((value: boolean) =>
      console.log(`APP COMPONENT DB READY : ${value}`)
    );
  }

  ngOnInit() {
    new OpenDialog({ message: 'Salut les gens', title: '', type: 'success' });
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
        this.navigate('/w/workstation');
        break;
      case 'newsFeed':
        this.navigate('/n/newsFeed');
        break;
      case 'onlineBanking':
        this.navigate('/b/banking');
        break;
      case 'onamob':
        this.navigate('/o/onamob');
        break;
      case 'marketPlace':
        this.navigate('/m/market');
        break;
      case 'admin':
        this.navigate('/a/admin');
        break;
      default:
        this.navigate('/n/newsFeed');
        break;
    }
  }

  // private managePlateformByURL();

  private navigate(url: string) {
    this.router.navigate([url]);
  }
}
