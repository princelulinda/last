import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { DbService } from '../../db/db.service';

export type ThemeModel =
  | 'banking-light'
  | 'banking-dark'
  | 'worstation-light'
  | 'workstation-dark';

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

  switchThemeState(theme: ThemeModel) {
    console.log('tsssssssss', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.classList.add(`bg-${theme.split('-')[0]}`);
  }

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
