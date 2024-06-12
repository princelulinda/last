import { Injectable } from '@angular/core';
import { DbService } from '../../db/db.service';
import { MainConfig } from '../../db/models';

import { environment } from '../../../../environments/environment';

export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'banking' | 'workstation';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  activeConfig: {
    activePlatform: string;
    activeTheme: ThemeModel;
    activeMode: ModeModel;
  } | null = null;

  constructor(private dbService: DbService) {
    // this.initAll();
  }

  getMainConfig() {
    // return this.dbService.liveQuery(async () => {
    //   await this.dbService.table('mainconfigs').where({ id: 1 }).toArray();
    // });
    return this.dbService.get(MainConfig.tableName, 1);
  }

  setMainConfig(
    activePlatform: string,
    activeTheme: ThemeModel,
    activeMode: ModeModel
  ) {
    return this.dbService.add(MainConfig.tableName, {
      activePlatform: activePlatform,
      activeTheme: activeTheme,
      activeMode: activeMode,
    });
  }

  initAll() {
    // this.dbService.initializeModels();
    const initFn = () => {
      console.log('PASSE ICI 1');
      this.switchPlatformState('newsfeed');
      // Init selected platform
      this.getMainConfig().subscribe({
        // eslint-disable-next-line
        next: (aConf: any) => {
          this.activeConfig = aConf as {
            activePlatform: string;
            activeTheme: ThemeModel;
            activeMode: ModeModel;
          } | null;
        },
      });
    };
    this.dbService.db.on('ready', initFn);
  }

  resetMode() {
    const defaultMode: ModeModel = 'light';
    if (this.activeConfig) {
      return this.setMainConfig(
        this.activeConfig?.activePlatform,
        this.activeConfig?.activeTheme,
        defaultMode
      );
    } else {
      return null;
    }
  }

  switchMode(newMode: ModeModel) {
    if (this.activeConfig) {
      return this.setMainConfig(
        this.activeConfig?.activePlatform,
        this.activeConfig?.activeTheme,
        newMode
      );
    } else {
      return null;
    }
  }

  isLightMode() {
    return this.activeConfig?.activeMode === 'light';
  }

  isDarkMode() {
    return this.activeConfig?.activeMode === 'dark';
  }

  // resetPlatform() {
  //   const defaultPlatform = '';
  //   const activeTheme = this.getActiveTheme();
  //   return this.setMainConfig(defaultPlatform, activeTheme);
  // }

  filterPlatformData(platform: string) {
    return (
      environment.plateformsUuid.filter(plUuid => plUuid.name === platform) ||
      []
    );
  }

  switchPlatformState(platform: string) {
    console.log('tsssssssss', platform);
    // const activeTheme = this.dbService.getConfig().platform; // light | dark
    const platformData = this.filterPlatformData(platform)[0];
    document.documentElement.setAttribute(
      'data-bs-theme',
      `${platformData.theme.name}-${this.activeConfig?.activeMode}`
    );
    document.body.classList.add(`bg-${platformData.theme.name}`);

    // Update the platform and theme
    this.setMainConfig(
      platform,
      platformData.theme.name as ThemeModel,
      this.activeConfig?.activeMode as ModeModel
    );
  }
}
