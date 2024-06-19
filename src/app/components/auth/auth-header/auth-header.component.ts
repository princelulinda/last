import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { ConfigService } from '../../../core/services';
// import { Observable } from 'rxjs';
import { DbService } from '../../../core/db';
// import { mainConfigModel } from '../../../core/db/models/config/main-config';
import { DexieService } from '../../../core/services/config/dexie.service';
// import { response } from 'express';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent implements OnInit {
  config$ = this.configService.getMainConfig();
  // config!: mainConfigModel;

  constructor(
    private configService: DexieService,
    private dbService: DbService
  ) {
    // this.config$ = this.configService
    //   .mainConfig$ as Observable<mainConfigModel>;
  }

  ngOnInit() {
    this.config$.subscribe(response => {
      console.log('Observable Data Main Config', response);
    });
  }

  switchMode() {
    this.configService.switchMode();
  }
}
