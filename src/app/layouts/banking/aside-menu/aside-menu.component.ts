import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

import { ConfigService, activeMainConfigModel } from '../../../core/services';
import { MenuService } from '../../../core/services/menu/menu.service';
@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;

  constructor(
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  hideAsideMenu() {
    this.menuService.toggleAsideMenu(true);
  }
}
