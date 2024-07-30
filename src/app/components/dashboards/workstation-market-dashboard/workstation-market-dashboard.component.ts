import { Component, OnInit } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService } from '../../../core/services';
import { Observable } from 'rxjs';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workstation-market-dashboard',
  standalone: true,
  imports: [SkeletonComponent, CommonModule],
  templateUrl: './workstation-market-dashboard.component.html',
  styleUrl: './workstation-market-dashboard.component.scss',
})
export class WorkstationMarketDashboardComponent implements OnInit {
  currentMode$: Observable<ModeModel>;
  currentMode!: ModeModel;

  constructor(private configService: ConfigService) {
    this.currentMode$ = this.configService.getMode();
  }

  ngOnInit() {
    this.currentMode$.subscribe({
      next: mode => {
        this.currentMode = mode;
      },
    });
  }
}
