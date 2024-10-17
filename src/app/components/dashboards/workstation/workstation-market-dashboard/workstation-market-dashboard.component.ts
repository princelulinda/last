import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, Subject, takeUntil } from 'rxjs';

import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { ConfigService, MerchantService } from '../../../../core/services';
import {
  ModeModel,
  PlateformModel,
} from '../../../../core/services/config/main-config.models';
import { mainConfigModel } from '../../../wallet/wallet.models';
import { MyMarketDashboardComponent } from '../../banking/my-market-dashboard/my-market-dashboard.component';
import { MerchantCardComponent } from '../../../merchant/global/merchant-card/merchant-card.component';
import { MerchantAutocompleteModel } from '../../../merchant/merchant.models';

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
export class WorkstationMarketDashboardComponent implements OnInit, OnDestroy {
  mainConfig$: Observable<mainConfigModel>;
  currentMode!: ModeModel;
  plateform!: PlateformModel;

  isMerchantCorporate!: boolean;
  isMerchantCorporte$: Observable<boolean>;

  isLoading = true;
  recentMerchants!: MerchantAutocompleteModel[];

  constructor(
    private configService: ConfigService,
    private merchantService: MerchantService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.isMerchantCorporte$ =
      this.configService.organizationIsMerchantCorporate();
  }
  private onDestroy$: Subject<void> = new Subject<void>();

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

    this.merchantService
      .getRecentMerchantsAutocomplete('')
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          const response = data as { objects: MerchantAutocompleteModel[] };
          this.recentMerchants = response.objects;
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
