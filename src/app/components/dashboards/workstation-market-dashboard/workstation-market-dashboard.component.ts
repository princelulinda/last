import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';

import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService, MerchantService } from '../../../core/services';
import {
  ModeModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';
import { mainConfigModel } from '../../wallet/wallet.models';
import { MyMarketDashboardComponent } from '../my-market-dashboard/my-market-dashboard.component';
import { Merchant_AutocompleteModel } from '../../merchant/global/merchant-card/merchant.model';
import { MerchantCardComponent } from '../../merchant/global/merchant-card/merchant-card.component';

@Component({
  selector: 'app-workstation-market-dashboard',
  standalone: true,
  imports: [
    SkeletonComponent,
    CommonModule,
    MyMarketDashboardComponent,
    SkeletonComponent,
    MerchantCardComponent,
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

  isLoading = true;
  recentMerchants!: Merchant_AutocompleteModel[];

  constructor(
    private configService: ConfigService,
    private merchantService: MerchantService
  ) {
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

    this.merchantService.getRecentMerchantsAutocomplete('').subscribe({
      next: data => {
        const response = data as { objects: Merchant_AutocompleteModel[] };
        this.recentMerchants = response.objects;
        this.isLoading = false;
      },
    });
  }
}
