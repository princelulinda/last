import { Injectable } from '@angular/core';
import { DbService } from '../../db/db.service';
import { MainConfig } from '../../db/models';

import { environment } from '../../../environments';

export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'banking' | 'workstation';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  activeConfig: {
    activePlatform: string;
    activeTheme: string;
    activeMode: string;
  } | null = null;

  constructor(private dbService: DbService) {
    this.initAll();
  }

  async getMainConfig() {
    // return this.db.liveQuery(async () => {
    //   await this.db.table('mainconfigs').where({ id: 1 }).toArray();
    // });
    return this.db.where(MainConfig.tableName, { id: 1 });
  }

  setMainConfig(
    activePlatform: string,
    activeTheme: ThemeModel,
    activeMode: ModeModel
  ) {
    return this.db.add(MainConfig.tableName, {
      activePlatform: activePlatform,
      activeTheme: activeTheme,
      activeMode: activeMode,
    });
  }

  initAll() {
    // Init selected platform
    getMainConfig().subscribe({
      next: conf => {
        this.activeConfig = conf;
      },
    });
  }

  resetMode() {
    const defaultMode: ModeModel = 'light';
    return this.setMainConfig(
      this.activeConfig.activePlatform,
      this.activeConfig.activeTheme,
      defaultMode
    );
  }

  switchMode(newMode: ModeModel) {
    const activePlatform = selectedPlateform;
    return this.setMainConfig(activePlatform, newMode);
  }

  isLightMode() {
    return this.activeConfig.activeMode === 'light';
  }

  isDarkMode() {
    return this.activeConfig.activeMode === 'dark';
  }

  // resetPlatform() {
  //   const defaultPlatform = '';
  //   const activeTheme = this.getActiveTheme();
  //   return this.setMainConfig(defaultPlatform, activeTheme);
  // }

  filterPlatformData(platform: string) {
    return (
      environment.plateformsUuid.filter((key: string) => key === platform) || []
    );
  }

  switchPlatformState(platform: string) {
    console.log('tsssssssss', platform);
    // const activeTheme = this.dbService.getConfig().platform; // light | dark
    const platformData = this.filterPlatformData(platform);
    document.documentElement.setAttribute(
      'data-bs-theme',
      `${platformData.theme.color}-${this.activeConfig?.activeMode}`
    );
    document.body.classList.add(`bg-${platformData.theme.color}`);

    // Update the platform and theme
    this.setMainConfig(
      platform,
      platformData.theme.color,
      this.activeConfig?.activeMode as ModeModel
    );
  }
}
