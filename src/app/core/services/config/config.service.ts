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
export class ConfigService {
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

  setMainConfig(payload: activeMainConfigModel) {
    // console.log(
    //   'Main ConFig ===++++ :',
    //   activePlatform,
    //   activeTheme,
    //   activeMode
    // );

    return this.dbService.addOnceUpdate(MainConfig.tableName, payload);
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

      this.setMainConfig(newActiveMainConfig);
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

  private filterPlatformData(plateform: PlateformModel): {
    name: string;
    uuid: string;
    theme: { name: string };
  } {
    return environment.plateformsUuid.filter(
      plateformData => plateformData.name === plateform
    )[0];
  }
  async switchPlateform(plateform: PlateformModel) {
    this.activeMainConfig = await this.getActiveMainConfig();
    if (plateform !== this.activeMainConfig.activePlateform) {
      const theme = this.filterPlatformData(plateform).theme.name as ThemeModel;

      this.setMainConfig({
        activePlateform: plateform,
        activeTheme: this.activeMainConfig.activeTheme,
        activeMode: this.activeMainConfig.activeMode,
      });
      this.setHtmlMode(theme, this.activeMainConfig.activeMode);
    }
  }

  async switchMode() {
    let newModeToDispatch: ModeModel;

    this.activeMainConfig = await this.getActiveMainConfig();
    if (this.activeMainConfig && this.activeMainConfig.activeMode) {
      newModeToDispatch =
        this.activeMainConfig.activeMode === 'dark' ? 'light' : 'dark';
    } else {
      newModeToDispatch = this.getPreferedMode();
    }
    const plateform: PlateformModel = this.getActivePlateform();
    const theme: ThemeModel = this.filterPlatformData(plateform).theme
      .name as ThemeModel;

    this.setMainConfig({
      activePlateform: plateform,
      activeTheme: theme,
      activeMode: newModeToDispatch,
    });
    this.setHtmlMode(this.activeMainConfig.activeTheme, newModeToDispatch);
  }
}
