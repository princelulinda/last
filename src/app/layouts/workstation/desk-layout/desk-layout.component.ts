import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

import { Observable } from 'rxjs';

import { ConfigService, MenuService } from '../../../core/services';
import {
  GroupMenuModel,
  MenuGroupsModel,
} from '../../../core/db/models/menu/menu.models';

@Component({
  selector: 'app-desk-layout',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './desk-layout.component.html',
  styleUrl: './desk-layout.component.scss',
})
export class DeskLayoutComponent implements OnInit {
  deskMenuGroups: MenuGroupsModel | null = null;
  selectedGroup: GroupMenuModel | null = null;

  private menuGroups$: Observable<MenuGroupsModel[]>;

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
          this.deskMenuGroups = menus.find(
            group => group.name === 'Desk'
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
