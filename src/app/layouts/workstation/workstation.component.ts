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
import { DbService } from '../../core/db';
import { ConnectedOperatorModel } from '../../components/auth/auth.model';
// import {
//   ConnectedOperatorModel,
//   OrganizationModel,
// } from '../../components/auth/auth.model';

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
  connectedOperator$: Observable<ConnectedOperatorModel>;
  connectedOperator: ConnectedOperatorModel | null = null;

  constructor(
    private dialogService: DialogService,
    private dbService: DbService,
    private authService: AuthService,
    private menuService: MenuService,
    private configService: ConfigService
  ) {
    this.connectedOperator$ = this.configService.getConnectedOperator();
  }

  ngOnInit() {
    this.connectedOperator$.subscribe({
      next: operator => {
        console.log('CHECK :: WORKSTATION LOCAL STORAGE CLIENT ID ');
        if (operator.organization) {
          this.dbService.setLocalStorageClientId(
            operator.organization.institution_client.id.toString()
          );
        }
      },
    });

    this.getOperatorMenusTypes_groups();
    this.dialogService.closeDialog();
    this.dialogService.closeSplashScreen();
  }

  // private getConnectedOperator_menus() {
  //   this.dialogService.dispatchSplashScreen();
  //   this.authService
  //     .getConnectedOperator()
  //     // .pipe(
  //     //   switchMap(operator =>
  //     //     this.getAllMenusTypes().pipe(
  //     //       map(menus => {
  //     //         return {
  //     //           menus: menus,
  //     //           operator: operator,
  //     //         };
  //     //       })
  //     //     )
  //     //   )
  //     // )
  //     .subscribe({
  //       next: response => {
  //         const operatorData = response.object.response_data.object;
  //         const operator: ConnectedOperatorModel = {
  //           operator: {
  //             id: operatorData?.operator.id as string,
  //             isTeller: operatorData?.is_teller as boolean,
  //             isTreasurer: operatorData?.is_treasurer as boolean,
  //           },
  //           organization: operatorData?.organization as OrganizationModel,
  //         };
  //         this.configService.setOperator(operator);
  //         this.dialogService.closeSplashScreen();
  //       },
  //       error: () => {
  //         // salut les gens
  //       },
  //     });
  // }

  private getOperatorMenusTypes_groups() {
    return this.menuService
      .getTypeMenuGroups()
      .pipe(
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
      )
      .subscribe({
        next: resp => {
          console.log('OOOOO', resp);
        },
      });
  }
}
