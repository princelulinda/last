import { Component, OnInit } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { Subject, takeUntil } from 'rxjs';
import { WorkstationService } from '../../../core/services/dashboards/workstation.service';
import { SessionToShow, StatResModel } from '../dashboard.model';
import { SessionsService } from '../../../core/services/sessions/sessions.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-workstation-dashboard',
  standalone: true,
  imports: [SkeletonComponent, CommonModule],
  providers: [DatePipe],
  templateUrl: './workstation-dashboard.component.html',
  styleUrl: './workstation-dashboard.component.scss',
})
export class WorkstationDashboardComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  statistics: StatResModel | null = null;
  session: SessionToShow | null = null;

  constructor(
    private workstationService: WorkstationService,
    private sessionsService: SessionsService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.workstationService
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
        console.log('session', this.session);
      });
  }
}
