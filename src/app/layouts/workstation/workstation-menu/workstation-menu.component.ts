import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfigService, MenuService } from '../../../core/services';
import {
  GroupMenuModel,
  MenuGroupsModel,
  MenuModel,
} from '../../../core/db/models/menu/menu.models';
import { Observable } from 'rxjs';
import { EmptyStateComponent } from '../../../global/components/empty-states/empty-state/empty-state.component';
import { NgClass } from '@angular/common';
import { ConnectedOperatorModel } from '../../../components/auth/auth.model';

@Component({
  selector: 'app-workstation-menu',
  standalone: true,
  imports: [RouterModule, EmptyStateComponent, NgClass],
  templateUrl: './workstation-menu.component.html',
  styleUrl: './workstation-menu.component.scss',
})
export class WorkstationMenuComponent implements OnInit {
  activatedTypeMenu: 'b' | 'm' | 'i' | 'd' | 'r' | 'a' | '' = '';
  private menuGroups$: Observable<MenuGroupsModel[]>;
  private menuGroups: MenuGroupsModel[] = [];

  activeMenuGroups: MenuGroupsModel | null = null;
  selectedGroup: GroupMenuModel | null = null;

  menu: MenuModel[] | null = null;
  loadingMenu = false;

  operator!: ConnectedOperatorModel;
  operator$: Observable<ConnectedOperatorModel>;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigService,
    private menuService: MenuService
  ) {
    this.menuGroups$ = this.configService.getMenuGroups();
    this.operator$ = this.configService.getConnectedOperator();
  }

  ngOnInit(): void {
    this.menuGroups$.subscribe({
      next: menus => {
        if (menus) {
          this.menuGroups = menus;
          this.getActiveMenuGroups();
        }
      },
    });
    this.operator$.subscribe({
      next: operator => {
        this.operator = operator;
      },
    });

    if (this.route.params) {
      this.route.params.subscribe({
        next: params => {
          this.activatedTypeMenu = params['TypeMenu'];
          if (this.menuGroups) {
            this.getActiveMenuGroups();
          }
        },
      });
    }
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

  private getActiveMenuGroups() {
    switch (this.activatedTypeMenu) {
      case 'a':
        this.activeMenuGroups = this.menuGroups.find(
          group => group.name === 'Admin'
        ) as MenuGroupsModel;
        break;

      case 'd':
        this.activeMenuGroups = this.menuGroups.find(
          group => group.name === 'Admin'
        ) as MenuGroupsModel;
        break;
      case 'i':
        this.activeMenuGroups = this.menuGroups.find(
          group => group.name === 'Intranet'
        ) as MenuGroupsModel;
        break;
      case 'r':
        this.activeMenuGroups = this.menuGroups.find(
          group => group.name === 'Reporting'
        ) as MenuGroupsModel;
        break;

      default:
        this.activeMenuGroups = null;
        break;
    }
  }
}
