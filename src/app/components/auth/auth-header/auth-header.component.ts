import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { activeMainConfigModel } from '../../../core/services/config/dexie.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services';

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

  constructor(private configService: ConfigService) {
    this.config$ = this.configService.getMainConfig();
  }

  ngOnInit() {
    this.config$.subscribe((response: activeMainConfigModel) => {
      console.log('Observable Data Main Config', response);
    });
  }

  switchMode() {
    this.configService.switchMode();
  }
}
