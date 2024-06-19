import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DbService } from '../../../core/db';
import { mainConfigModel } from '../../../core/db/models/config/main-config';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent implements OnInit {
  config$: Observable<mainConfigModel>;
  config!: mainConfigModel;
  isProduction: boolean = environment.production;
  appVersion: string | number = environment.appVersion;

  constructor(
    private configService: ConfigService,
    private dbService: DbService
  ) {
    this.config$ = this.configService
      .mainConfig$ as Observable<mainConfigModel>;
  }

  ngOnInit() {
    this.config$?.subscribe((response: mainConfigModel) => {
      console.log('Observable Data Main Config', response);
    });
  }

  switchMode() {
    this.configService.switchMode();
  }
}
