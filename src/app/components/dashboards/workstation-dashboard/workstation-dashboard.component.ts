import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-workstation-dashboard',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './workstation-dashboard.component.html',
  styleUrl: './workstation-dashboard.component.scss',
})
export class WorkstationDashboardComponent {}
