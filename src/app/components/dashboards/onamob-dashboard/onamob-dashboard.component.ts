import { Component } from '@angular/core';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

@Component({
  selector: 'app-onamob-dashboard',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './onamob-dashboard.component.html',
  styleUrl: './onamob-dashboard.component.scss',
})
export class OnamobDashboardComponent {
  numbers = [1, 2, 3, 4];
}
