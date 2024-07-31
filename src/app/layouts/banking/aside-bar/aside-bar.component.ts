import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService } from '../../../core/services';
import { PlateformModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent implements OnInit {
  plateform$!: Observable<PlateformModel>;
  plateform!: PlateformModel;

  constructor(private configService: ConfigService) {
    this.plateform$ = this.configService.getPlateform();
  }

  ngOnInit(): void {
    this.plateform$.subscribe({
      next: plateform => {
        this.plateform = plateform;
      },
    });
  }
}
