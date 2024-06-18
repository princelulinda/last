import { Injectable } from '@angular/core';
import { DbService } from '../../db/db.service';
import { MainConfig } from '../../db/models';

import { environment } from '../../../../environments/environment';

export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'ihela' | 'magis';

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
    return this.dbService.liveQuery(
      this.dbService.getOnce(MainConfig.tableName)
    );
  }

  setMainConfig(
    activePlatform: string,
    activeTheme: ThemeModel,
    activeMode: ModeModel
  ) {
    console.log('Active mode +++ :', activePlatform, activeTheme, activeMode);
    this.setActiveConfig(activePlatform, activeTheme, activeMode);

    return this.dbService.addOnceUpdate(MainConfig.tableName, {
      activePlatform: activePlatform,
      activeTheme: activeTheme,
      activeMode: activeMode,
    });
  }

  getPreferedMode(): ModeModel {
    if (!this.activeConfig?.activeMode) {
      return (
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light') ?? 'light'
      );
    } else {
      return this.activeConfig.activeMode;
    }
  }

  setActiveConfig(platform: string, theme: ThemeModel, mode: ModeModel) {
    this.activeConfig = {
      activeMode: mode,
      activePlatform: platform,
      activeTheme: theme,
    };
  }

  initAll() {
    // this.dbService.initializeModels();
    const initFn = () => {
      this.switchMode();
      this.setActiveConfig(
        this.activeConfig?.activePlatform as string,
        this.activeConfig?.activeTheme as ThemeModel,
        this.activeConfig?.activeMode as ModeModel
      );

      this.switchPlatformState('newsfeed');
      // Init selected platform
      const configSubscription = this.getMainConfig();
      console.log('CONFIG SUBS : ', configSubscription);
      configSubscription.subscribe({
        // eslint-disable-next-line
        next: (aConf: any) => {
          this.activeConfig = aConf as {
            activePlatform: string;
            activeTheme: ThemeModel;
            activeMode: ModeModel;
          } | null;
        },
      });
      // TODO : Unsuscribe 'configSubscription'
    };
    this.dbService.dbIsReady.subscribe((value: boolean) => {
      console.log(`INITIALIZING ALL CONFIG FOR DB READY ${value}`);
      initFn();
    });
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

  switchMode() {
    let newMode!: ModeModel;
    let appTheme!: ThemeModel;

    console.log(
      'OLD MODE : ',
      this.activeConfig?.activeMode,
      this.activeConfig?.activeMode == 'dark'
    );

    if (this.activeConfig) {
      newMode = this.activeConfig.activeMode == 'dark' ? 'light' : 'dark';
      appTheme = this.activeConfig?.activeTheme;
    } else {
      newMode = this.getPreferedMode();
      appTheme = 'ihela';
      console.log('PREFERED MODE : ', newMode);
    }

    console.log('NEW MODE : ', newMode);

    this.setMainConfig(
      this.activeConfig?.activePlatform as string,
      appTheme,
      newMode
    );
    this.setHtmlMode(appTheme, newMode);
  }

  setHtmlMode(newTheme: ThemeModel, newMode: ModeModel) {
    // We cannot set a mode that does not exist
    if (newMode && newTheme) {
      console.log('SETTING HTML MODE : ', newTheme, ' - ', newMode);
      document.documentElement.setAttribute(
        'data-bs-theme',
        `${newTheme}-${newMode}`
      );
      document.body.classList.add(`bg-${newTheme}`);
    }
  }

  isLightMode(): boolean {
    return this.activeConfig?.activeMode === 'light';
  }

  isDarkMode(): boolean {
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

  switchPlatformState(platform: string): void {
    console.log('tsssssssss', platform);
    // const activeTheme = this.dbService.getConfig().platform; // light | dark
    const platformData = this.filterPlatformData(platform)[0];
    this.setHtmlMode(
      platformData.theme.name as ThemeModel,
      this.activeConfig?.activeMode as ModeModel
    );

    // Update the platform and theme
    this.setMainConfig(
      platform,
      platformData.theme.name as ThemeModel,
      this.activeConfig?.activeMode as ModeModel
    );
  }
}
