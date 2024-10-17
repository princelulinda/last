import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { ConfigService } from '../../../core/services';
import {
  ActiveMainConfigModel,
  PlateformModel,
} from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-switch-plateform-icons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './switch-plateform-icons.component.html',
  styleUrl: './switch-plateform-icons.component.scss',
})
export class SwitchPlateformIconsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mainConfig$: Observable<ActiveMainConfigModel>;
  mainConfig!: ActiveMainConfigModel;

  bankingPlateformIcon = '/icons/banking-light-icon.svg';

  plateforms: {
    plateform: PlateformModel | 'market';
    title: string;
    image: string;
    icon: string;
    is_selected: boolean;
    link: string;
  }[] = [
    {
      plateform: 'newsFeed',
      title: 'Switch On News Feed',
      image: '',
      icon: 'fa-solid fa-house-chimney-user fa-xl',
      is_selected: true,
      link: '/n/newsfeed',
    },
    {
      plateform: 'onlineBanking',
      title: 'Switch On Banking',
      icon: '',
      image: '',
      is_selected: false,
      link: '/b/banking',
    },
    {
      plateform: 'onamob',
      title: 'Switch On Onamob',
      image: '',
      icon: 'fa-solid fa-mobile-screen-button fa-xl',
      is_selected: false,
      link: '/o/onamob',
    },
    {
      plateform: 'market',
      title: 'Switch On Market Place',
      image: '',
      icon: 'fa-solid fa-cart-shopping fa-xl',
      is_selected: false,
      link: '/m/market',
    },
    {
      plateform: 'workstation',
      title: 'Switch On Workstation',
      image: '',
      icon: 'fa-solid fa-desktop fa-xl',
      is_selected: false,
      link: '/auth/corporate',
    },
  ];

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
        if (this.mainConfig?.activePlateform === 'onlineBanking') {
          this.bankingPlateformIcon = '/icons/banking-primary-icon.svg';
        } else if (this.mainConfig?.activePlateform === 'workstation') {
          if (this.mainConfig?.activeMode === 'light') {
            this.bankingPlateformIcon = '/icons/banking-dark-icon.svg';
          } else {
            this.bankingPlateformIcon = '/icons/banking-light-icon.svg';
          }
        } else {
          this.bankingPlateformIcon = '/icons/banking-light-icon.svg';
        }
      },
    });
  }

  switchPlateform(plateform: PlateformModel | 'market') {
    if (plateform === 'market') {
      this.configService.switchPlateform('marketPlace');
    } else {
      this.configService.switchPlateform(plateform);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  isMarketPlatform(): boolean {
    return (
      this.mainConfig?.activePlateform === 'marketPlace' ||
      this.mainConfig?.activePlateform === 'myMarket'
    );
  }

  // toggleMarket() {
  //     this.store.dispatch(new SelectMarket({ marketName: 'market' }));
  // }
}
