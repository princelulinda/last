import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ConfigService,
  activeMainConfigModel,
} from '../../../../core/services';

@Component({
  selector: 'app-switch-plateform-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch-plateform-icons.component.html',
  styleUrl: './switch-plateform-icons.component.scss',
})
export class SwitchPlateformIconsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mainConfig$: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  plateforms = [
    {
      plateform: 'authentification',
      title: 'Switch On Home',
      image: '',
      icon: 'fa-solid fa-house-chimney-user fa-xl',
      is_selected: true,
    },
    {
      plateform: 'onlineBanking',
      title: 'Switch On Banking',
      icon: '',
      image: '/images/ihela-b.svg',
      is_selected: false,
    },
    {
      plateform: 'onamob',
      title: 'Switch On Onamob',
      image: '',
      icon: 'fa-solid fa-mobile-screen-button fa-xl',
      is_selected: false,
    },
    {
      plateform: 'market',
      title: 'Switch On My market',
      image: '',
      icon: 'fa-solid fa-cart-shopping fa-xl',
      is_selected: false,
    },
    {
      plateform: 'workStation',
      title: 'Switch On WorkStation',
      image: '',
      icon: 'fa-solid fa-desktop fa-xl',
      is_selected: false,
    },
  ];

  constructor(private configService: ConfigService) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit() {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // toggleMarket() {
  //     this.store.dispatch(new SelectMarket({ marketName: 'market' }));
  // }
}
