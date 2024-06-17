import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService } from '../../../core/services';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent implements OnInit {
  constructor(private configService: ConfigService) {}

  ngOnInit() {
    const obs = this.configService.getMainConfig();
    console.log('OBS ::: ', obs);

    obs.subscribe({
      next: response => {
        console.log('ppppppppppp Main Config', response);
      },
    });
  }

  switchMode() {
    this.configService.switchMode();
  }
}
