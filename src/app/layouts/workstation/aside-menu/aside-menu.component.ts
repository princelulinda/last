import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SwitchModeComponent } from '../../../global/components/switch-mode/switch-mode.component';
import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../core/services';
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
  showtooltipLogout = false;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.typeMenus$ = this.configService.getTypeMenus();
  }

  ngOnInit() {
    this.typeMenus$.subscribe({
      next: menus => {
        if (menus) {
          this.typeMenus = this.configService.toArray(menus);

          // TODO :: TO REMOVE
          this.typeMenus.forEach(menu => {
            if (menu.name === 'Banking') {
              menu.url = '/w/workstation/b/banking';
            } else if (menu.name === 'Market') {
              menu.url = '/w/workstation/m/market';
            } else if (menu.name === 'Desk') {
              menu.url = '/w/workstation/d/desk';
            } else if (menu.name === 'Admin') {
              menu.url = '/w/workstation/a/admin';
            } else if (menu.name === 'Intranet') {
              menu.url = '/w/workstation/i/intranet';
            }
          });
        }
      },
    });
  }
  setLocalSelecteTypedMenu(menu: number) {
    this.configService.setLocalSelectedTypeMenu(menu.toString());
  }

  logoutCorporate() {
    this.dialogService.dispatchLoading();
    this.authService.logoutCorporate().subscribe({
      next: () => {
        this.configService.clearAllMenu();
        this.configService.resetOperator();
        this.router.navigate(['/auth/corporate']);
        this.dialogService.closeLoading();
      },
      error: err => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: '',
          message:
            err?.object?.response_message ??
            'Something went wrong, please retry again!',
        });
      },
    });
  }

  toogleTooltip(status: boolean) {
    this.showtooltipLogout = status;
  }
}
