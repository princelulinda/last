import { Component, OnInit } from '@angular/core';
import {
  ConfigService,
  activeMainConfigModel,
} from '../../../../core/services';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings-aside-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-aside-menu.component.html',
  styleUrl: './settings-aside-menu.component.scss',
})
export class SettingsAsideMenuComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  isSessionMenusShown = false;
  selectedMenu = '';
  isSecurityMenusShown = false;
  selectedSubMenu = '';
  isGeneralSubMensShown = false;
  activePopupMenu = '';
  constructor(
    private configService: ConfigService,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
  }

  ngOnInit(): void {
    if (this.router.url === '/b/settings/security') {
      this.selectedMenu = 'security';
      this.isSecurityMenusShown = true;
      this.selectedSubMenu = 'pin';
    } else if (this.router.url === '/b/settings') {
      this.selectedMenu = 'general';
      this.selectedSubMenu = 'account';
      this.isGeneralSubMensShown = true;
    } else if (this.router.url === '/b/settings/sessions') {
      this.selectedMenu = 'sessions';
      this.isSessionMenusShown = true;
    }
    this.selectSubMenu(this.selectedMenu, this.selectedSubMenu);
    this.toggleMenuPopup(this.activePopupMenu);
  }

  toggleMenuPopup(activePopupMenu: string) {
    if (this.activePopupMenu === activePopupMenu) {
      this.activePopupMenu = '';
    } else {
      this.activePopupMenu = activePopupMenu;
    }
  }

  selectSubMenu(selectedMenu: string, selectedSubMenu: string) {
    this.settingsService.selectSubMenu(selectedSubMenu);
    this.selectedSubMenu = selectedSubMenu;

    if (selectedMenu === 'security') {
      this.router.navigateByUrl('/b/settings/security');
    }

    if (selectedMenu === 'general') {
      this.router.navigateByUrl('/b/settings');
    }
    if (selectedMenu === 'session') {
      this.router.navigateByUrl('/b/settings/session');
    }
  }
}
