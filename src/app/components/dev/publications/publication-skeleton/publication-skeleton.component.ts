import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-publication-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './publication-skeleton.component.html',
  styleUrl: './publication-skeleton.component.scss',
})
export class PublicationSkeletonComponent {}
