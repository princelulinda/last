import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { ConfigService } from '../../../core/services';
// import { Observable } from 'rxjs';
import { DbService } from '../../../core/db';
// import { mainConfigModel } from '../../../core/db/models/config/main-config';
import {
  DexieService,
  activeMainConfigModel,
} from '../../../core/services/config/dexie.service';
import { Observable } from 'rxjs';
// import { response } from 'express';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent implements OnInit {
  config$: Observable<activeMainConfigModel>;
  config!: activeMainConfigModel;

  constructor(
    private dexieSerivice: DexieService,
    private dbService: DbService
  ) {
    this.config$ = this.dexieSerivice.getMainConfig();
  }

  ngOnInit() {
    this.config$.subscribe((response: activeMainConfigModel) => {
      console.log('Observable Data Main Config', response);
    });
  }

  switchMode() {
    this.dexieSerivice.switchMode();
  }
}
