import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsFeedService } from '../../../core/services/newsFeed/news-feed.service';
import { PublicationModel } from '../../dashboards/dashboard.model';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { PublicationCardComponent } from './publication-card/publication-card.component';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ShowMoreDirective } from '../../../global/directives/show-more/show-more.directive';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    CommonModule,
    PublicationCardComponent,
    SkeletonComponent,
    ShowMoreDirective,
  ],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.scss',
})
export class PublicationsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  publications: PublicationModel[] | [] | null = null;
  isLoading = false;

  constructor(
    private newsFeedService: NewsFeedService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getPublications();
  }

  getPublications() {
    this.isLoading = true;
    this.newsFeedService
      .getPublication()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: res => {
          const publicationsRes = res as { objects: PublicationModel[] };
          this.publications = publicationsRes.objects;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.dialogService.openToast({
            message:
              err?.object?.response_message ??
              'Something went wrong please retry again !',
            title: '',
            type: 'failed',
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
