import * as Services from './services';
import * as Guards from './guards';
import * as Interceptors from './interceptors';

export const AllServices = [
  Services.ApiService,
  Services.AuthService,
  Services.ConfigService,
  Services.FullpathService,
  Services.DialogService,
  Services.BankService,
  Services.ClientService,
  Services.FileService,
  Services.GeneralService,
  Services.LoanService,
  Services.MenuService,
  Services.MerchantService,
  Services.SavingDetailService,
  Services.SettingsService,
  Services.TarifService,
];

export const AllGuards = [
  Guards.AuthGuard,
  Guards.NoAuthGuard,
  Guards.AuthWorkstationGuard,
  Guards.bankingGuard,
  Guards.treasurerGuard,
  Guards.windowGuard,
  Guards.workstationGuard,
  Guards.DBReadyGuard,
  Guards.PlateformGuard,
];

export const NonDiInterceptors = [
  Interceptors.clientInfoInterceptor,
  Interceptors.httpTokenInterceptor,
];
