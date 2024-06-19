import { Injectable } from '@angular/core';
import { DbService } from '../../db';
import { MainConfig } from '../../db/models';
import { environment } from '../../../../environments/environment';

export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'ihela' | 'magis';

@Injectable({
  providedIn: 'root',
})
export class DexieService {
  // mainConfig$: unknown | Observable<mainConfigModel>;

  constructor(private dbService: DbService) {
    // if (MainConfig) {
    //   this.mainConfig$ = liveQuery(() =>
    //     this.dbService.getOnce(MainConfig.tableName)
    //   );
    // }
  }

  async isData() {
    const dataNum = await this.dbService.db.table(MainConfig.tableName).count();
    return dataNum > 0;
  }

  getMainConfig() {
    // return this.mainConfig$;

    return this.dbService.liveQuery(() =>
      this.dbService.getOnce(MainConfig.tableName)
    );
  }

  setMainConfig(
    activePlatform: string,
    activeTheme: ThemeModel,
    activeMode: ModeModel
  ) {
    console.log(
      'Main ConFig ===++++ :',
      activePlatform,
      activeTheme,
      activeMode
    );

    return this.dbService.addOnceUpdate(MainConfig.tableName, {
      activePlatform,
      activeTheme,
      activeMode,
    });
  }

  async getPreferedMode(): Promise<ModeModel> {
    const hasData = await this.isData();
    if (!hasData) {
      const prefered =
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light') ?? 'light';
      return prefered;
    } else {
      const data = await this.dbService.db
        .table(MainConfig.tableName)
        .orderBy(':id')
        .first();
      return data.activeMode;
    }
  }

  async initialize() {
    const mode = await this.getPreferedMode();
    const row = {
      activePlatform: 'newsfeed',
      activeTheme: 'ihela',
      activeMode: mode,
    };

    this.setHtmlMode('ihela', row.activeMode);

    this.dbService.db
      .table(MainConfig.tableName)
      .add(row)
      .then(() => {
        console.log('Data added successfully to IndexedDB');
      })
      .catch(error => {
        console.error('Error adding data to IndexedDB:', error);
      });
  }

  initAll() {
    const initFn = async () => {
      const hasData = await this.isData();
      console.log('INDEXEDDB HASDATA?? = ', hasData);
      if (!hasData) {
        this.initialize();
        console.log('NNOOOO DATAAAA FOUND');
      } else {
        const row = await this.dbService.db
          .table(MainConfig.tableName)
          .orderBy(':id')
          .first();
        console.log('(((((((((((((((((())))row Foound', row);

        this.setHtmlMode(row.activeTheme, row.activeMode);
      }
    };

    this.dbService.dbIsReady.subscribe((value: boolean) => {
      console.log(`INITIALIZING ALL CONFIG FOR DB READY ${value}`);
      initFn();
    });
  }

  async switchMode() {
    let appTheme!: ThemeModel;
    let activeMode!: ModeModel;
    const hasData = await this.isData();
    if (hasData) {
      const row = await this.dbService.db
        .table(MainConfig.tableName)
        .orderBy(':id')
        .first();
      appTheme = row.activeTheme;
      const oldMode: ModeModel = row.activeMode;
      activeMode = oldMode == 'dark' ? 'light' : 'dark';

      this.dbService.db
        .table(MainConfig.tableName)
        .update(row.id, { activeMode });
    } else {
      this.initialize();
      appTheme = 'ihela';
      activeMode = await this.getPreferedMode();
    }
    this.setHtmlMode(appTheme, activeMode);
  }

  setHtmlMode(newTheme: ThemeModel, newMode: ModeModel) {
    if (newMode && newTheme) {
      console.log('SETTING HTML mode :', newTheme, ' - ', newMode);
      document.documentElement.setAttribute(
        'data-bs-theme',
        `${newTheme}-${newMode}`
      );
      document.body.classList.add(`bg-${newTheme}`);
    }
  }

  filterPlatformData(platform: string) {
    return (
      environment.plateformsUuid.filter(plUuid => plUuid.name === platform) ||
      []
    );
  }

  async switchPlatformState(platform: string): Promise<void> {
    console.log('tsssssssss', platform);
    let mode;
    const hasData = await this.isData();

    if (hasData) {
      const row = await this.dbService.db
        .table(MainConfig.tableName)
        .orderBy(':id')
        .first();
      mode = row.activeMode;
    } else {
      mode = this.getPreferedMode();
    }

    const platformData = this.filterPlatformData(platform)[0];
    this.setHtmlMode(platformData.theme.name as ThemeModel, mode as ModeModel);

    // Update the platform and theme
    this.setMainConfig(
      platform,
      platformData.theme.name as ThemeModel,
      mode as ModeModel
    );
  }
}
