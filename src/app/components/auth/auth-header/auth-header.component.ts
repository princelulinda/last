import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { Observable } from 'rxjs';
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

  constructor(
    private configService: ConfigService,
    private dbService: DbService
  ) {
    this.config$ = this.configService
      .mainConfig$ as Observable<mainConfigModel>;
  }

  ngOnInit() {
    this.config$?.subscribe((response: mainConfigModel) => {
      alert('new Data Comming');
      console.log('oooooooooo', response);
    });
  }

  switchMode() {
    this.configService.switchMode();
  }
}
