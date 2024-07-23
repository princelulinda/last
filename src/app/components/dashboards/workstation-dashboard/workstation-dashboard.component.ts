import { Component, OnInit } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { Subject, takeUntil } from 'rxjs';
import { WorkstationService } from '../../../core/services/dashboards/workstation.service';
import { StatResModel } from '../dashboard.model';

@Component({
  selector: 'app-workstation-dashboard',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './workstation-dashboard.component.html',
  styleUrl: './workstation-dashboard.component.scss',
})
export class WorkstationDashboardComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  statistics: StatResModel | null = null;

  constructor(private workstationService: WorkstationService) {}

  ngOnInit() {
    this.workstationService
      .getWorkstationStats()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(stat => {
        const res = stat as { object: StatResModel };
        this.statistics = res.object;
      });
  }
}
