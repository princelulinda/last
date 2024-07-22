export type ModeModel = 'light' | 'dark';
export type ThemeModel = 'ihela' | 'magis' | 'erp' | 'onamob';
export type PlateformModel =
  | 'authentification'
  | 'newsFeed'
  | 'onlineBanking'
  | 'onamob'
  | 'marketPlace'
  | 'myMarket'
  | 'workstation'
  | 'systemAdmin'
  | 'bankingSettings';
export interface activeMainConfigModel {
  activeMode: ModeModel;
  activeTheme: ThemeModel;
  activePlateform: PlateformModel;
}
