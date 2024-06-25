import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent {
  isProduction: boolean = environment.production;
  appVersion: string | number = environment.appVersion;

  constructor(private configService: ConfigService) {}

  switchMode() {
    this.configService.switchMode();
  }
}
