import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../../core/services/sessions/sessions.service';
import {
  activeSessionResponse,
  historySessionResponse,
} from '../setting.model';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { DatePipe } from '@angular/common';
import { LowerCasePipe } from '@angular/common';
import { PaginationConfig } from '../../../global/global.model';
import { takeUntil, Subject } from 'rxjs';
@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [SkeletonComponent, DatePipe, LowerCasePipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
})
export class SessionsComponent implements OnInit {
  activeSessions!: activeSessionResponse[];
  historySessions!: historySessionResponse[];
  countActive!: number;
  activeSessionLoading = false;
  isLoadingHistorySessions = false;
  displaySessionFilters = false;
  pagination = new PaginationConfig();
  currentPage = 0;
  pages!: string;
  count!: number;

  canMoveToPrev = false;
  canMoveToNext = true;
  selectedId = '';
  detailButtonActiveSession = 'rotate(0deg)';
  countHistory!: number;
  isLoadingEndSession = false;
  sessionId!: string;

  ngOnInit() {
    this.getActiveSession();
    this.getHystorySession();
  }
  constructor(private SessionsService: SessionsService) {
    //
  }

  lim!: number;
  osFamily!: string;
  private onDestroy$: Subject<void> = new Subject<void>();

  getActiveSession(searchValue?: string) {
    this.activeSessionLoading = true;
    this.pagination.filters.limit = 15;
    this.lim = this.pagination.filters.limit;

    this.SessionsService.getActiveSession(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.activeSessionLoading = false;
          this.activeSessions = data.objects;
          this.countActive = data.count;
          console.log('operating system', this.countActive);

          if (this.activeSessions.length === 0) {
            //
          }
        },
        error: () => {
          this.activeSessionLoading = false;
        },
      });
  }

  doListMove1(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }
    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      this.getActiveSession();
    }
  }
  doListMove2(action: string) {
    if (action === 'next') {
      this.currentPage += 1;
    } else {
      this.currentPage -= 1;
    }

    // condition just for typescript
    if (this.pagination.filters.limit) {
      this.pagination.filters.offset =
        this.pagination.filters.limit * this.currentPage;
      this.getHystorySession();
      // console.log(this.currentPage);
    }
  }
  onButtonClick() {
    const searchValue = '';
    this.getActiveSession(searchValue);
  }

  getHystorySession(searchValue?: string) {
    this.isLoadingHistorySessions = true;
    this.pagination.filters.limit = 15;
    this.lim = this.pagination.filters.limit;
    this.SessionsService.getHistorySessions(searchValue, this.pagination)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.isLoadingHistorySessions = false;
          this.historySessions = data.objects;
          this.countHistory = data.count;
          if (this.historySessions.length === 0) {
            //
          }
        },
        error: () => {
          this.isLoadingHistorySessions = false;
        },
      });
  }
  endActiveSession!: activeSessionResponse[];
  endSession(sessionId: string) {
    this.isLoadingEndSession = true;
    this.SessionsService.endSession(sessionId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: activeSessionResponse) => {
          this.endActiveSession = data.objects;
          this.isLoadingEndSession = false;
          this.getActiveSession();
        },
        error: () => {
          this.isLoadingEndSession = false;
        },
      });
  }

  refresh() {
    this.getHystorySession();
  }
  refreshactivesession() {
    this.getActiveSession();
  }

  rotateActiveSessionButton(id: string) {
    if (
      this.selectedId === id &&
      this.detailButtonActiveSession === 'rotate(45deg)'
    ) {
      this.detailButtonActiveSession = 'rotate(0deg)';
    } else {
      this.selectedId = id;
      this.detailButtonActiveSession = 'rotate(45deg)';
    }
  }
  detailButtonHistorySession = 'rotate(0deg)';

  rotateHistorySessionButton(id: string) {
    if (
      this.selectedId === id &&
      this.detailButtonHistorySession === 'rotate(45deg)'
    ) {
      this.detailButtonHistorySession = 'rotate(0deg)';
    } else {
      this.selectedId = id;
      this.detailButtonHistorySession = 'rotate(45deg)';
    }
  }

  ActiveSessionButtonRotation(id: string) {
    return this.selectedId === id
      ? this.detailButtonActiveSession
      : 'rotate(0deg)';
  }
  historySessionButtonRotation(id: string) {
    return this.selectedId === id
      ? this.detailButtonHistorySession
      : 'rotate(0deg)';
  }
}
