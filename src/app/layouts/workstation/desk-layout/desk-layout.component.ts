import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

import { Observable } from 'rxjs';

import { ConfigService, MenuService } from '../../../core/services';
import {
  GroupMenuModel,
  MenuGroupsModel,
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
    if (group === this.selectedGroup) {
      this.selectedGroup = null;
    }
    this.selectedGroup = group;
    // this.getMenuByGroup(this.selectedGroup.id.toString());
  }
}
