import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-workstation-market-dashboard',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './workstation-market-dashboard.component.html',
  styleUrl: './workstation-market-dashboard.component.scss',
})
export class WorkstationMarketDashboardComponent {}
