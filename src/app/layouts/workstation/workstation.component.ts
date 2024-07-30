import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { map, Observable, switchMap } from 'rxjs';

import { HeaderComponent } from '../header/header.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import {
  AuthService,
  ConfigService,
  DialogService,
  MenuService,
} from '../../core/services';
import {
  ConnectedOperatorModel,
  OrganizationModel,
} from '../../components/auth/auth.model';

@Component({
  selector: 'app-workstation',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AsideMenuComponent,
    SideBarComponent,
    RouterModule,
  ],
  templateUrl: './workstation.component.html',
  styleUrl: './workstation.component.scss',
})
export class WorkstationComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private menuService: MenuService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.getOperatorMenusTypes_groups();
    this.getAllMenuGroup();
    alert('oooooooooooook');
  }

  private getConnectedOperator_menus() {
    this.dialogService.dispatchSplashScreen();
    this.authService
      .getConnectedOperator()
      // .pipe(
      //   switchMap(operator =>
      //     this.getAllMenusTypes().pipe(
      //       map(menus => {
      //         return {
      //           menus: menus,
      //           operator: operator,
      //         };
      //       })
      //     )
      //   )
      // )
      .subscribe({
        next: response => {
          const operatorData = response.object.response_data.object;
          const operator: ConnectedOperatorModel = {
            operator: {
              id: operatorData?.operator.id as string,
              isTeller: operatorData?.is_teller as boolean,
              isTreasurer: operatorData?.is_treasurer as boolean,
            },
            organization: operatorData?.organization as OrganizationModel,
          };
          this.configService.setOperator(operator);
          this.dialogService.closeSplashScreen();
        },
        error: () => {
          // salut les gens
        },
      });
  }

  private getOperatorMenusTypes_groups(): Observable<{
    menuTypes: unknown;
    menuGroup: unknown;
  }> {
    return this.menuService.getTypeMenuGroups().pipe(
      switchMap(data =>
        this.menuService.getAllMenuGroup().pipe(
          map(menuGroup => {
            return {
              menuTypes: data,
              menuGroup: menuGroup,
            };
          })
        )
      )
    );
  }

  getAllMenuGroup() {
    this.menuService.getAllMenuGroup().subscribe({
      next: menu_groups => {
        console.log('MENUS GROUPS', menu_groups);
      },
    });
  }
}
