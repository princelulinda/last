import { Component, OnInit } from '@angular/core';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { Observable } from 'rxjs';
import { activeMainConfigModel } from '../../../../core/services';
import { ConfigService } from '../../../../core/services';

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
