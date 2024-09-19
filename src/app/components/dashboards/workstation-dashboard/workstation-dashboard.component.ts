import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { SessionToShow, StatResModel } from '../dashboard.model';
import { SessionsService } from '../../../core/services/sessions/sessions.service';
import { GeneralService } from '../../../core/services';
import { CheckAccessDirective } from '../../../global/directives/access/check-access.directive';

@Component({
  selector: 'app-workstation-dashboard',
  standalone: true,
  imports: [SkeletonComponent, CommonModule, CheckAccessDirective],
  templateUrl: './workstation-dashboard.component.html',
  styleUrl: './workstation-dashboard.component.scss',
})
export class WorkstationDashboardComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  statistics: StatResModel | null = null;
  session: SessionToShow | null = null;

  constructor(
    private generalService: GeneralService,
    private sessionsService: SessionsService
  ) {}

  ngOnInit() {
    this.generalService
      .getWorkstationStats()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(stat => {
        const res = stat as { object: StatResModel };
        this.statistics = res.object;
      });

    this.sessionsService
      .getUserSession()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(data => {
        const res = data as { object: SessionToShow };
        this.session = res.object;
      });
  }
}
