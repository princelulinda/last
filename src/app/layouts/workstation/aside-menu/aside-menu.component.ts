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
        console.log('TYPE MENU', this.typeMenus);
      },
    });
  }
  setLocalSelectedMenu(menu: number) {
    this.configService.setLocalSelectedMenu(menu.toString());
  }
}
