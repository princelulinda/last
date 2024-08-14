import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService } from '../../../core/services';
import {
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { mainConfigModel } from '../../wallet/wallet.models';
import { MyMarketDashboardComponent } from '../my-market-dashboard/my-market-dashboard.component';

@Component({
  selector: 'app-workstation-market-dashboard',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    MyMarketDashboardComponent,
    SkeletonComponent,
  ],
  templateUrl: './workstation-market-dashboard.component.html',
  styleUrl: './workstation-market-dashboard.component.scss',
})
export class WorkstationMarketDashboardComponent implements OnInit {
  mainConfig$: Observable<mainConfigModel>;
  currentMode!: ModeModel;
  plateform!: PlateformModel;

  isMerchantCorporate!: boolean;
  isMerchantCorporte$: Observable<boolean>;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.isMerchantCorporte$ =
      this.configService.organizationIsMerchantCorporate();
  }

  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        if (configs) {
          this.plateform = configs.activePlateform as PlateformModel;
          this.currentMode = configs.activeMode as ModeModel;
        }
      },
    });
    this.isMerchantCorporte$.subscribe({
      next: resp => {
        this.isMerchantCorporate = resp;
      },
    });
  }
}
