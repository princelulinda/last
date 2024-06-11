import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DbService } from '../../db/db.service';

export type ThemeModel = 'banking' | 'workstation';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(
    private apiService: ApiService,
    private dbService: DbService
  ) {
    //code
  }

  theme!: ThemeModel;

  switchPlatformState(platform: ThemeModel) {
    console.log('tsssssssss', platform);
    // const activeTheme = this.dbService.getConfig().platform; // light | dark
    const activeTheme = 'light';
    document.documentElement.setAttribute(
      'data-bs-theme',
      `${platform}-${activeTheme}`
    );
    document.body.classList.add(`bg-${platform}`);

    // this.dbService.setConfig({platform});
  }

  // switchThemeState(theme: ThemeModel) {
  //   console.log('tsssssssss', theme);
  //   const activePlateform = this.dbService.getConfig().theme; // ihela | magis
  //   document.documentElement.setAttribute('data-bs-theme', `${activePlateform}-${theme}`);
  //   document.body.classList.add(`bg-${theme.split('-')[0]}`);

  //   // this.dbService.setConfig({theme});
  // }

  /* To manage theme systeme for anywere */

  // manageThemeState(): void {
  //   this.theme = document.documentElement.getAttribute(
  //     'data-bs-theme'
  //   ) as ThemeModel;
  //   console.log('opakdpakda', this.theme);
  // }

  getTheme(): string {
    return '';
  }
}
