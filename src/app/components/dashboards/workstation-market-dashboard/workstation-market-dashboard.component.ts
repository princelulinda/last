import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService } from '../../../core/services';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { mainConfigModel } from '../../wallet/wallet.models';

@Component({
  selector: 'app-workstation-market-dashboard',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    WorkstationMarketDashboardComponent,
  ],
  templateUrl: './workstation-market-dashboard.component.html',
  styleUrl: './workstation-market-dashboard.component.scss',
})
export class WorkstationMarketDashboardComponent implements OnInit {
  mainconfig!: mainConfigModel;
  mainConfig$: Observable<mainConfigModel>;
  currentMode!: ModeModel;

  isMerchantCorporate = false;
  isMerchantCorporte$: Observable<boolean>;

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.isMerchantCorporte$ =
      this.configService.organizationIsMerchantCorporate();
  }

  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainconfig = configs;
      },
    });
    this.isMerchantCorporte$.subscribe({
      next: resp => {
        this.isMerchantCorporate = resp;
      },
    });
  }
}
