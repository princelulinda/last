import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { HeaderComponent } from '../header/header.component';
import { AsideMenuComponent } from './aside-menu/aside-menu.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ConfigService, DialogService, MenuService } from '../../core/services';
import { DbService } from '../../core/db';
import { ConnectedOperatorModel } from '../../components/auth/auth.model';

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

  typeMenuExist$: Observable<boolean>;

  constructor(
    private dialogService: DialogService,
    private dbService: DbService,
    private menuService: MenuService,
    private configService: ConfigService
  ) {
    this.connectedOperator$ = this.configService.getConnectedOperator();
    this.typeMenuExist$ = this.configService.checkTypeMenus();
  }

  ngOnInit() {
    this.connectedOperator$.subscribe({
      next: operator => {
        if (operator && operator.organization) {
          this.configService.setLocalConnectedOperator('true');
        } else {
          this.configService.setLocalConnectedOperator('false');
        }
      },
    });
    this.typeMenuExist$.subscribe({
      next: state => {
        if (state) {
          this.dialogService.closeDialog();
          this.dialogService.closeSplashScreen();
        } else {
          this.getOperatorMenus();
        }
      },
    });
  }

  // NOTE :: TYPE MENUS GET ALL MENU GROUPS AND MENUS
  private getOperatorMenus() {
    return this.menuService.getTypeMenuGroups().subscribe({
      next: resp => {
        this.configService.setTypeMenus(resp.objects);
        this.dialogService.closeDialog();
        this.dialogService.closeSplashScreen();
      },
      error: err => {
        this.dialogService.openToast({
          message:
            err?.object?.response_message ??
            'Something went wrong, please retry again!',
          title: '',
          type: 'failed',
        });
      },
    });
  }
}
