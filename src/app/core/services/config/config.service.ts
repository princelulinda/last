import { Injectable } from '@angular/core';

import { liveQuery } from 'dexie';
import { Observable, Subject } from 'rxjs';

import { DbService } from '../../db';
import { Bank, MainConfig, SelectedBank, Operator } from '../../db/models';
import { environment } from '../../../../environments/environment';

import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { bankModel } from '../../db/models/bank/bank.model';
import {
  ConnectedOperatorModel,
  OrganizationModel,
} from '../../../components/auth/auth.model';

import {
  activeMainConfigModel,
  ModeModel,
  PlateformModel,
  ThemeModel,
} from './main-config.models';
import { Organizations } from '../../db/models/organisations/organizations';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private activeMainConfig!: activeMainConfigModel;
  private mainConfig$: unknown | Observable<activeMainConfigModel>;

  private actifPlateform = new Subject<PlateformModel>();
  private actifTheme = new Subject<ThemeModel>();
  private actifMode = new Subject<ModeModel>();

  private userBanks$: unknown | Observable<bankModel[]>;
  private selectedBank$: unknown | Observable<bankModel>;

  private connectedOperator$: unknown | Observable<ConnectedOperatorModel>;
  private operatorOrganization = new Subject<OrganizationModel | null>();
  private isAuthenticatedOperator = new Subject<boolean>();
  private isTreasurerOperator = new Subject<boolean>();

  private allOrganizations$: unknown | Observable<OrganizationModel[]>;
  // private organizations_without_Selected$ = new Subject<OrganizationModel[]>();

  constructor(
    private dbService: DbService,
    private apiService: ApiService,
    private router: Router
  ) {
    if (MainConfig) {
      this.mainConfig$ = liveQuery(() =>
        this.dbService.getOnce(MainConfig.tableName)
      );
    }
    this.userBanks$ = liveQuery(() => this.dbService.getOnce(Bank.tableName));
    this.selectedBank$ = liveQuery(() =>
      this.dbService.getOnce(SelectedBank.tableName)
    );
    this.connectedOperator$ = liveQuery(() =>
      this.dbService.getOnce(Operator.tableName)
    );
    this.allOrganizations$ = liveQuery(() =>
      this.dbService.getOnce(Organizations.tableName)
    );
  }

  // NOTE :: MAIN CONFIG INITIALISATION METHODS

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
  // async initPopulate() {
  //   const localToken = this.apiService.getLocalToken();
  //   const clientId = this.apiService.getLocalClientId();
  //   const dbUser = await this.dbService.getDbUser();
  //   if ((!localToken || !clientId) && dbUser) {
  //     // this.apiService.clearLocalData();
  //     this.dbService.setLocalStorageUserToken(dbUser.user.token);
  //     this.dbService.setLocalStorageClientId(
  //       dbUser.client.client_id.toString()
  //     );
  //   } else if (!dbUser) {
  //     // this.apiService.clearLocalData();
  //     // this.dbService.populate();
  //   }
  // }

  // NOTE :: GETTING MAIN CONFIGS METHODS

  getMainConfig(): Observable<activeMainConfigModel> {
    return this.mainConfig$ as Observable<activeMainConfigModel>;
  }

  getPlateform(): Observable<PlateformModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifPlateform.next(mainConfig.activePlateform);
        }
      },
    });
    return this.actifPlateform;
  }

  getTheme(): Observable<ThemeModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifTheme.next(mainConfig.activeTheme);
        }
      },
    });
    return this.actifTheme;
  }

  getMode(): Observable<ModeModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifMode.next(mainConfig.activeMode);
        }
      },
    });
    return this.actifMode;
  }

  // NOTE :: SWITCH MAIN CONFIGS METHODS

  async switchPlateform(plateform: PlateformModel, redirectToBaseHref = true) {
    this.activeMainConfig = await this.getActiveMainConfig();
    if (plateform !== this.activeMainConfig.activePlateform) {
      const plateformData = this.filterPlatformData(plateform);
      const theme = plateformData.theme.name;
      const baseHref = plateformData.baseHref;

      this.apiService.setLocalPlateform(plateform);
      this.setMainConfig({
        activePlateform: plateform,
        activeTheme: this.activeMainConfig.activeTheme,
        activeMode: this.activeMainConfig.activeMode,
      });
      this.setHtmlMode(theme, this.activeMainConfig.activeMode);
      if (redirectToBaseHref) {
        this.router.navigate([baseHref]);
      }
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

  async clearDB() {
    // DELETE DATABASE
    // await this.dbService.db.delete();
    this.apiService.clearLocalData();
    // await this.dbService.initializeModels();
    // this.initAll();
  }

  // NOTE :: Banks methods

  setUserBanks(banks: bankModel[]) {
    this.dbService.addOnce(Bank.tableName, banks);
  }
  setSelectedBank(selectedBank: bankModel) {
    this.dbService.addOnce(SelectedBank.tableName, selectedBank);
    this.dbService.setLocalStorageBankId(selectedBank.id);
  }
  resetSelectedBank(): void {
    this.dbService.clearTable(SelectedBank.tableName);
    this.dbService.removeLocalStorageBankId();
  }
  getUserBanks(): Observable<bankModel[]> {
    return this.userBanks$ as Observable<bankModel[]>;
  }
  getSelectedBank(): Observable<bankModel> {
    return this.selectedBank$ as Observable<bankModel>;
  }

  // NOTE :: operator methods

  setOperator(operator: ConnectedOperatorModel) {
    this.dbService.addOnceUpdate(Operator.tableName, operator);
  }
  resetOperator(): void {
    this.dbService.clearTable(Operator.tableName);
    this.resetOrganizations();
  }
  getConnectedOperator(): Observable<ConnectedOperatorModel> {
    return this.connectedOperator$ as Observable<ConnectedOperatorModel>;
  }
  getSelectedOrganization(): Observable<OrganizationModel | null> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        this.operatorOrganization.next(operator.organization ?? null);
      },
    });
    return this.operatorOrganization;
  }
  operatorIsAuthenticated(): Observable<boolean> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator) {
          if (operator.operator && operator.organization) {
            this.isAuthenticatedOperator.next(true);
          } else {
            this.isAuthenticatedOperator.next(false);
          }
        } else {
          this.isAuthenticatedOperator.next(false);
        }
      },
      error: () => {
        this.isAuthenticatedOperator.next(false);
      },
    });
    return this.isAuthenticatedOperator;
  }
  operatorIsTreasurer(): Observable<boolean> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator) {
          if (operator.operator.isTreasurer) {
            this.isTreasurerOperator.next(true);
          } else {
            this.isTreasurerOperator.next(false);
          }
        } else {
          this.isTreasurerOperator.next(false);
        }
      },
    });
    return this.isTreasurerOperator;
  }

  // NOTE :: ORGANIZATIONS METHODS

  setOperatorOrganizations(organizations: OrganizationModel[]): void {
    this.dbService.addOnce(Organizations.tableName, organizations);
  }
  private resetOrganizations(): void {
    this.dbService.clearTable(Organizations.tableName);
  }
  getOperatorOrganizations(): Observable<OrganizationModel[]> {
    return this.allOrganizations$ as Observable<OrganizationModel[]>;
  }

  // NOTE :: PRIVATE CONFIG METHODS

  private async getActiveMainConfig(): Promise<activeMainConfigModel> {
    const data: activeMainConfigModel = await this.dbService.getOnce(
      MainConfig.tableName
    );
    this.activeMainConfig = data;
    return data;
  }
  private setMainConfig(payload: activeMainConfigModel): void {
    this.dbService.addOnceUpdate(MainConfig.tableName, payload);
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
    name: PlateformModel;
    uuid: string;
    theme: { name: ThemeModel };
    baseHref: string;
  } {
    return environment.plateformsUuid.filter(
      plateformData => plateformData.name === plateform
    )[0];
  }
}
