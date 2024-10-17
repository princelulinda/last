export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'ihela' | 'magis' | 'erp' | 'onamob';
export type ScreenStateModel = 'locked' | 'unlocked';
export type PlateformModel =
  | 'authentification'
  | 'newsFeed'
  | 'onlineBanking'
  | 'onamob'
  | 'marketPlace'
  | 'myMarket'
  | 'workstation'
  | 'systemAdmin'
  | 'bankingSettings'
  | 'market';

export interface ActiveMainConfigModel {
  activeMode: ModeModel;
  activeTheme: ThemeModel;
  activePlateform: PlateformModel;
  screenLocked: ScreenStateModel;
}
