import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../../core/services';
import { environment } from '../../../../environments/environment';
import { SwitchModeComponent } from '../../../global/components/switch-mode/switch-mode.component';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SwitchModeComponent],
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
