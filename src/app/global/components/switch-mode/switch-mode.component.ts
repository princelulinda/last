import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-switch-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-mode.component.html',
  styleUrls: ['./switch-mode.component.scss'],
})
export class SwitchModeComponent implements OnInit {
  mode!: ModeModel;
  activeMode$: Observable<ModeModel>;

  constructor(private configService: ConfigService) {
    this.activeMode$ = this.configService.getMode();
  }

  ngOnInit() {
    this.activeMode$.subscribe({
      next: response => {
        this.mode = response;
      },
    });
  }

  onThemeSwitchChange() {
    this.configService.switchMode();
  }
}
