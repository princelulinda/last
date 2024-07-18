import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-switch-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-mode.component.html',
  styleUrls: ['./switch-mode.component.scss'],
})
export class SwitchModeComponent implements OnInit {
  mode!: ModeModel;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getMode().subscribe({
      next: response => {
        this.mode = response;
        console.log('mode récupéré:', this.mode);
      },
    });
  }

  onThemeSwitchChange() {
    this.configService.switchMode();
  }
}
