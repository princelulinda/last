import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService } from '../../../core/services';
import { activeMainConfigModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-aside-bar',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './aside-bar.component.html',
  styleUrl: './aside-bar.component.scss',
})
export class AsideBarComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }
}
