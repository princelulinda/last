import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SwitchModeComponent } from '../../../components/dev/switch-mode/switch-mode.component';
import { ConfigService } from '../../../core/services';
import { Observable } from 'rxjs';
import { TypeMenuModel } from '../../../core/db/models/menu/menu.models';

@Component({
  selector: 'app-aside-menu',
  standalone: true,
  imports: [RouterModule, NgClass, SwitchModeComponent],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss',
})
export class AsideMenuComponent implements OnInit {
  typeMenus: TypeMenuModel[] = [];
  typeMenus$: Observable<TypeMenuModel[]>;

  constructor(private configService: ConfigService) {
    this.typeMenus$ = this.configService.getTypeMenus();
  }

  ngOnInit() {
    this.typeMenus$.subscribe({
      next: menus => {
        this.typeMenus = menus;
        this.typeMenus.map(menu => {
          switch (menu.id) {
            case 1:
              menu.url = '/w/workstation';
              break;
            case 2:
              menu.url = '/w/workstation/banking';
              break;
            case 3:
              menu.url = '/w/workstation/market';
              break;
            case 4:
              menu.url = '/w/workstation/intranet';
              break;
            case 5:
              menu.url = '/w/workstation/reporting';
              break;
            case 6:
              menu.url = '/w/workstation/admin';
              break;
          }
        });
        console.log('TYPE MENU', this.typeMenus);
      },
    });
  }
  setLocalSelectedMenu(menu: number) {
    this.configService.setLocalSelectedMenu(menu.toString());
  }
}
