import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

import { Observable } from 'rxjs';

import { ConfigService, MenuService } from '../../../core/services';
import {
  GroupMenuModel,
  MenuGroupsModel,
  MenuModel,
} from '../../../core/db/models/menu/menu.models';
import { EmptyStateComponent } from '../../../global/components/empty-states/empty-state/empty-state.component';

@Component({
  selector: 'app-desk-layout',
  standalone: true,
  imports: [RouterModule, NgClass, EmptyStateComponent],
  templateUrl: './desk-layout.component.html',
  styleUrl: './desk-layout.component.scss',
})
export class DeskLayoutComponent implements OnInit {
  private menuGroups$: Observable<MenuGroupsModel[]>;
  deskMenuGroups: MenuGroupsModel | null = null;
  selectedGroup: GroupMenuModel | null = null;

  menu: MenuModel[] | null = null;
  loadingMenu = false;

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
    this.loadingMenu = true;
    this.menu = null;
    this.menuService.getMenuByGroup(group_id).subscribe({
      next: menu => {
        this.menu = menu.objects;
        this.loadingMenu = false;
      },
    });
  }

  selectGroup(group: GroupMenuModel) {
    this.selectedGroup = group;
    this.getMenuByGroup(this.selectedGroup.id.toString());
  }
}
