import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfigService, ModeModel } from '../../../core/services';

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
    this.configService.getMainConfig().subscribe({
      next: response => {
        console.log('ppppppppppp Main Config', response);
      },
    });
  }

  switchMode(mode: ModeModel) {
    this.configService.switchMode(mode);
  }
}
