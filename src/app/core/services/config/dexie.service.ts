import { Injectable } from '@angular/core';
import { DbService } from '../../db';
import { MainConfig } from '../../db/models';
import { environment } from '../../../../environments/environment';
import { liveQuery } from 'dexie';
import { Observable } from 'rxjs';

export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'ihela' | 'magis';
export type PlateformModel =
  | 'authentification'
  | 'newsFeed'
  | 'onlineBanking'
  | 'marketPlace'
  | 'workstation'
  | 'amin';
export interface activeMainConfigModel {
  activeMode: ModeModel;
  activeTheme: ThemeModel;
  activePlateform: PlateformModel;
}

@Injectable({
  providedIn: 'root',
})
export class DexieService {
  activeMainConfig!: activeMainConfigModel;

  mainConfig$: unknown | Observable<activeMainConfigModel>;

  constructor(private dbService: DbService) {
    if (MainConfig) {
      this.mainConfig$ = liveQuery(() =>
        this.dbService.getOnce(MainConfig.tableName)
      );
    }
  }
  private async getActiveMainConfig(): Promise<activeMainConfigModel> {
    const data: activeMainConfigModel = await this.dbService.getOnce(
      MainConfig.tableName
    );
    this.activeMainConfig = data;
    return data;
  }

  getMainConfig(): Observable<activeMainConfigModel> {
    return this.mainConfig$ as Observable<activeMainConfigModel>;
  }

  setMainConfig(
    activePlatform: PlateformModel,
    activeTheme: ThemeModel,
    activeMode: ModeModel
  ) {
    // console.log(
    //   'Main ConFig ===++++ :',
    //   activePlatform,
    //   activeTheme,
    //   activeMode
    // );

    return this.dbService.addOnceUpdate(MainConfig.tableName, {
      activePlatform,
      activeTheme,
      activeMode,
    });
  }

  private getPreferedMode(): ModeModel {
    if (!this.activeMainConfig || !this.activeMainConfig.activeMode) {
      const prefered =
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light') ?? 'light';
      return prefered;
    } else {
      return this.activeMainConfig.activeMode;
    }
  }

  private getActivePlateform(): PlateformModel {
    if (!this.activeMainConfig || !this.activeMainConfig.activePlateform) {
      return 'authentification';
    } else {
      return this.activeMainConfig.activePlateform as PlateformModel;
    }
  }

  initAll() {
    const initFn = async () => {
      await this.getActiveMainConfig();
      const mode = this.getPreferedMode();
      const plateform = this.getActivePlateform();
      const theme = this.filterPlatformData(plateform).theme.name as ThemeModel;
      this.setHtmlMode(theme, mode);

      const newActiveMainConfig: activeMainConfigModel = {
        activeMode: mode,
        activePlateform: plateform,
        activeTheme: theme,
      };
      this.activeMainConfig = newActiveMainConfig;

      this.dbService.addOnce(MainConfig.tableName, newActiveMainConfig);
    };

    this.dbService.dbIsReady.subscribe((value: boolean) => {
      console.log(`INITIALIZING ALL CONFIG FOR DB READY ${value}`);
      initFn();
    });
  }

  private setHtmlMode(newTheme: ThemeModel, newMode: ModeModel) {
    if (newMode && newTheme) {
      document.documentElement.setAttribute(
        'data-bs-theme',
        `${newTheme}-${newMode}`
      );
      document.body.classList.add(`bg-${newTheme}`);
    }
  }

  private filterPlatformData(platform: string): {
    name: string;
    uuid: string;
    theme: { name: string };
  } {
    return environment.plateformsUuid.filter(
      plUuid => plUuid.name === platform
    )[0];
  }
  async switchPlateform(plateform: PlateformModel) {
    this.activeMainConfig = await this.getActiveMainConfig();
    if (plateform !== this.activeMainConfig.activePlateform) {
      const theme = this.filterPlatformData(plateform).theme.name as ThemeModel;
      this.setMainConfig(
        plateform,
        this.activeMainConfig.activeTheme,
        this.activeMainConfig.activeMode
      );
      this.setHtmlMode(theme, this.activeMainConfig.activeMode);
    }
  }

  async switchMode() {
    let newModeToDispatch: ModeModel;

    this.activeMainConfig = await this.getActiveMainConfig();
    console.log('TRY to get new mode to dispatch', this.activeMainConfig);
    if (this.activeMainConfig && this.activeMainConfig.activeMode) {
      newModeToDispatch =
        this.activeMainConfig.activeMode === 'dark' ? 'light' : 'dark';
    } else {
      newModeToDispatch = await this.getPreferedMode();
    }
    const plateform: PlateformModel = this.getActivePlateform();
    const theme: ThemeModel = this.filterPlatformData(plateform).theme
      .name as ThemeModel;

    this.setMainConfig(plateform, theme, newModeToDispatch);
    this.setHtmlMode(this.activeMainConfig.activeTheme, newModeToDispatch);
  }
}
