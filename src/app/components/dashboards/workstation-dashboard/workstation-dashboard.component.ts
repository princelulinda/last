import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { SessionToShow, StatResModel } from '../dashboard.model';
import { SessionsService } from '../../../core/services/sessions/sessions.service';
import { GeneralService, MenuService } from '../../../core/services';
import { PageMenusModel } from '../../admin/menu/menu.models';

@Component({
  selector: 'app-workstation-dashboard',
  standalone: true,
  imports: [SkeletonComponent, CommonModule],
  templateUrl: './workstation-dashboard.component.html',
  styleUrl: './workstation-dashboard.component.scss',
})
export class WorkstationDashboardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  statistics: StatResModel | null = null;
  session: SessionToShow | null = null;

  pageMenus: PageMenusModel[] = [
    {
      icon: 'list',
      title: 'Menus List',
      url: '/w/workstation',
    },
    {
      icon: 'list',
      title: 'Menus List',
      url: '/w/workstation/desk/admin/menus',
    },
  ];

  constructor(
    private generalService: GeneralService,
    private sessionsService: SessionsService,
    private menuService: MenuService
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

    this.menuService.setPageMenus(this.pageMenus);
  }

  ngOnDestroy() {
    this.menuService.destroyPageMenus();
  }
}
