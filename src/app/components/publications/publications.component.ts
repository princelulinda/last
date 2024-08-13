import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

import { PublicationCardComponent } from './publication-card/publication-card.component';
import { SkeletonComponent } from '../../global/components/loaders/skeleton/skeleton.component';
import { ShowMoreDirective } from '../../global/directives/show-more/show-more.directive';
import { PublicationModel } from '../dashboards/dashboard.model';
import { DialogService } from '../../core/services';
import { PublicationService } from '../../core/services/publication/publication.service';

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
  @Input() countSkeletons = 3;

  publications: PublicationModel[] | [] | null = null;
  isLoading = false;

  constructor(
    private publicationService: PublicationService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.getPublications();
  }

  getPublications() {
    this.isLoading = true;
    this.publicationService
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

  getArray(count: number): number[] {
    return new Array(count);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
