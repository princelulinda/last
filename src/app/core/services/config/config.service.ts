import { Injectable } from '@angular/core';

import { liveQuery } from 'dexie';
import { Observable, Subject } from 'rxjs';

import { DbService } from '../../db';
import {
  Bank,
  MainConfig,
  SelectedBank,
  Operator,
  TypeMenu,
} from '../../db/models';
import { environment } from '../../../../environments/environment';

import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';
import { BankModel } from '../../db/models/bank/bank.model';
import {
  ConnectedOperatorModel,
  OrganizationModel,
} from '../../../components/auth/auth.model';

import {
  activeMainConfigModel,
  ModeModel,
  PlateformModel,
  ScreenStateModel,
  ThemeModel,
} from './main-config.models';
import { Organizations } from '../../db/models/organisations/organizations';
import { TypeMenuModel } from '../../db/models/menu/menu.models';
import { AccessModel } from '../../../components/admin/access/access.models';
import { Access } from '../../db/models/access';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private activeMainConfig!: activeMainConfigModel;
  private mainConfig$: unknown | Observable<activeMainConfigModel>;

  private actifPlateform$ = new Subject<PlateformModel>();
  private actifTheme$ = new Subject<ThemeModel>();
  private actifMode$ = new Subject<ModeModel>();
  private screenState$ = new Subject<ScreenStateModel>();

  private userBanks$: unknown | Observable<BankModel[]>;
  private selectedBank$: unknown | Observable<BankModel>;

  private connectedOperator$: unknown | Observable<ConnectedOperatorModel>;
  private operatorOrganization$ = new Subject<OrganizationModel | null>();
  private isAuthenticatedOperator$ = new Subject<boolean>();
  private isMerchantCorporate$ = new Subject<boolean>();

  private organizationId$ = new Subject<number | null>();
  private allOrganizations$: unknown | Observable<OrganizationModel[]>;

  private typeMenus$: unknown | Observable<TypeMenuModel[]>;
  private typeMenusExist$ = new Subject<boolean>();
  private selectedTypeMenu$: unknown | Observable<TypeMenuModel>;

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

    this.typeMenus$ = liveQuery(() =>
      this.dbService.getOnce(TypeMenu.tableName)
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
      let screenState: ScreenStateModel;
      if (this.activeMainConfig) {
        screenState = this.activeMainConfig.screenLocked;
      } else {
        screenState = 'unlocked';
      }

      const newActiveMainConfig: activeMainConfigModel = {
        activeMode: mode,
        activePlateform: plateform,
        activeTheme: theme,
        screenLocked: screenState,
      };
      this.activeMainConfig = newActiveMainConfig;

      this.setMainConfig(newActiveMainConfig);
    };

    this.dbService.dbIsReady.subscribe(() => {
      initFn();
    });
  }

  // NOTE :: GETTING MAIN CONFIGS METHODS

  getMainConfig(): Observable<activeMainConfigModel> {
    return this.mainConfig$ as Observable<activeMainConfigModel>;
  }

  getPlateform(): Observable<PlateformModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifPlateform$.next(mainConfig.activePlateform);
        }
      },
    });
    return this.actifPlateform$;
  }

  getScreenState(): Observable<ScreenStateModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.screenState$.next(mainConfig.screenLocked);
        }
      },
    });
    return this.screenState$;
  }
  async switchScreenState(state: ScreenStateModel) {
    this.activeMainConfig = await this.getActiveMainConfig();
    this.setMainConfig({
      activeMode: this.activeMainConfig.activeMode,
      activePlateform: this.activeMainConfig.activePlateform,
      activeTheme: this.activeMainConfig.activeTheme,
      screenLocked: state,
    });
  }

  getTheme(): Observable<ThemeModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifTheme$.next(mainConfig.activeTheme);
        }
      },
    });
    return this.actifTheme$;
  }

  getMode(): Observable<ModeModel> {
    this.getMainConfig().subscribe({
      next: mainConfig => {
        if (mainConfig) {
          this.actifMode$.next(mainConfig.activeMode);
        }
      },
    });
    return this.actifMode$;
  }

  // NOTE :: SWITCH MAIN CONFIGS METHODS

  async switchPlateform(plateform: PlateformModel, redirectToBaseHref = true) {
    this.activeMainConfig = await this.getActiveMainConfig();
    if (plateform !== this.activeMainConfig.activePlateform) {
      const plateformData = this.filterPlatformData(plateform);
      const theme = plateformData.theme.name;
      const baseHref = plateformData.baseHref;

      if (
        this.activeMainConfig.activePlateform === 'workstation' ||
        plateform === 'workstation'
      ) {
        this.resetSelectedBank();
      }

      this.apiService.setLocalPlateform(plateform);
      this.setMainConfig({
        activePlateform: plateform,
        activeTheme: this.activeMainConfig.activeTheme,
        activeMode: this.activeMainConfig.activeMode,
        screenLocked: this.activeMainConfig.screenLocked,
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
      screenLocked: this.activeMainConfig.screenLocked,
    });
    this.setHtmlMode(this.activeMainConfig.activeTheme, newModeToDispatch);
  }

  async clearDB() {
    this.dbService.db.close();
    await this.dbService.db.delete();
    this.apiService.clearLocalData();
    await this.dbService.initializeModels();
    this.initAll();
  }

  // NOTE :: Banks methods

  setUserBanks(banks: BankModel[]) {
    this.dbService.addOnce(Bank.tableName, banks);
  }
  setSelectedBank(selectedBank: BankModel) {
    this.dbService.addOnceUpdate(SelectedBank.tableName, selectedBank);
    this.dbService.setLocalStorageBankId(selectedBank.id);
  }
  resetSelectedBank(): void {
    this.dbService.clearTable(SelectedBank.tableName);
    this.apiService.resetLocalBankId();
  }
  getUserBanks(): Observable<BankModel[]> {
    return this.userBanks$ as Observable<BankModel[]>;
  }
  getSelectedBank(): Observable<BankModel> {
    return this.selectedBank$ as Observable<BankModel>;
  }

  // NOTE :: operator methods

  setOperator(operator: ConnectedOperatorModel) {
    this.dbService.addOnceUpdate(Operator.tableName, operator);
  }
  resetOperator(): void {
    this.dbService.clearTable(Operator.tableName);
  }
  getConnectedOperator(): Observable<ConnectedOperatorModel> {
    return this.connectedOperator$ as Observable<ConnectedOperatorModel>;
  }
  getSelectedOrganization(): Observable<OrganizationModel | null> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator) {
          this.operatorOrganization$.next(operator.organization ?? null);
        } else {
          this.operatorOrganization$.next(null);
        }
      },
    });
    return this.operatorOrganization$;
  }
  operatorIsAuthenticated(): Observable<boolean> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator) {
          if (operator.operator && operator.organization) {
            this.isAuthenticatedOperator$.next(true);
          } else {
            this.isAuthenticatedOperator$.next(false);
          }
        } else {
          this.isAuthenticatedOperator$.next(false);
        }
      },
      error: () => {
        this.isAuthenticatedOperator$.next(false);
      },
    });
    return this.isAuthenticatedOperator$;
  }
  getLocalConnectedOperator(): boolean {
    const status = this.apiService.getLocalConnectedOperator();
    if (status === 'true') {
      return true;
    } else {
      return false;
    }
  }
  setLocalConnectedOperator(status: 'true' | 'false') {
    this.apiService.setLocalConnectedOperator(status);
  }
  organizationIsMerchantCorporate(): Observable<boolean> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator && operator.organization) {
          if (operator.organization.have_merchant_system) {
            this.isMerchantCorporate$.next(true);
          } else {
            this.isMerchantCorporate$.next(false);
          }
        } else {
          this.isMerchantCorporate$.next(false);
        }
      },
    });
    return this.isMerchantCorporate$;
  }

  // NOTE :: ORGANIZATIONS METHODS

  setOperatorOrganizations(organizations: OrganizationModel[]): void {
    this.dbService.addOnce(Organizations.tableName, organizations);
  }
  getOperatorOrganizations(): Observable<OrganizationModel[]> {
    return this.allOrganizations$ as Observable<OrganizationModel[]>;
  }
  getOrganizationId(): Observable<number | null> {
    this.getConnectedOperator().subscribe({
      next: operator => {
        if (operator && operator.organization) {
          this.organizationId$.next(operator.organization.id);
        } else {
          this.organizationId$.next(null);
        }
      },
      error: () => {
        this.organizationId$.next(null);
      },
    });
    return this.organizationId$;
  }

  // NOTE :: MENUS METHODS
  getTypeMenus(): Observable<TypeMenuModel[]> {
    return this.typeMenus$ as Observable<TypeMenuModel[]>;
  }

  setTypeMenus(payload: TypeMenuModel[]) {
    this.dbService.addOnceUpdate(TypeMenu.tableName, payload);
  }

  clearAllMenu() {
    this.dbService.clearTable(TypeMenu.tableName);
    // this.dbService.clearTable(SelectedTypeMenu.tableName);
  }
  checkTypeMenus(): Observable<boolean> {
    this.getTypeMenus().subscribe({
      next: menus => {
        if (menus === undefined || menus === null || menus.length === 0) {
          this.typeMenusExist$.next(false);
        } else {
          this.typeMenusExist$.next(true);
        }
      },
      error: () => {
        this.typeMenusExist$.next(false);
      },
    });
    return this.typeMenusExist$;
  }
  setLocalSelectedTypeMenu(menu: string) {
    this.apiService.setLocalSelectedTypeMenu(menu);
  }

  getSelectedTypeMenu(): Observable<TypeMenuModel> {
    return this.selectedTypeMenu$ as Observable<TypeMenuModel>;
  }

  // NOTE :: ACCESS METHODS
  setActiveAccesses(data: AccessModel[]) {
    this.dbService.addOnceUpdate(Access.tableName, data);
  }

  getActiveAccesses(): Promise<AccessModel[]> {
    return this.dbService.getOnce(Access.tableName) as Promise<AccessModel[]>;
  }

  clearActiveAccesses(): void {
    this.dbService.clearTable(Access.tableName);
  }

  // NOTE :: GENERAL METHOD
  toArray<T>(data: T[]): T[] {
    if (Array.isArray(data)) {
      return data as T[];
    } else {
      return Array.from(Object.values(data)).slice(0, -1) as T[];
    }
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
      const prefered = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
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
