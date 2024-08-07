import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import {
  GroupMenuModel,
  MenuGroupsModel,
} from '../../../core/db/models/menu/menu.models';
import { ConfigService, MenuService } from '../../../core/services';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-intranet-layout',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './intranet-layout.component.html',
  styleUrl: './intranet-layout.component.scss',
})
export class IntranetLayoutComponent implements OnInit {
  intranetMenuGroups: MenuGroupsModel | null = null;
  private menuGroups$: Observable<MenuGroupsModel[]>;
  selectedGroup: GroupMenuModel | null = null;

  constructor(
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.menuGroups$ = this.configService.getMenuGroups();
  }

  ngOnInit(): void {
    this.menuGroups$.subscribe({
      next: menus => {
        if (menus) {
          this.intranetMenuGroups = menus.find(
            group => group.name === 'Intranet'
          ) as MenuGroupsModel;
        }
      },
    });
  }

  getMenuByGroup(group_id: string) {
    this.menuService.getMenuByGroup(group_id).subscribe({
      next: menu => {
        console.log('oook menu', menu);
      },
    });
  }

  selectGroup(group: GroupMenuModel) {
    this.selectedGroup = group;
    this.getMenuByGroup(this.selectedGroup.id.toString());
  }
}
