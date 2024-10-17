import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { ActiveMainConfigModel } from '../../../core/services/config/main-config.models';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-saving-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './saving-dashboard.component.html',
  styleUrl: './saving-dashboard.component.scss',
})
export class SavingDashboardComponent implements OnInit, OnDestroy {
  activePlatform: string | null = null;
  mainConfig$!: Observable<ActiveMainConfigModel>;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  private onDestroy$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
