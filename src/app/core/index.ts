import * as Services from './services';
import * as Guards from './guards';
import * as Interceptors from './interceptors';

export const AllServices = [
  Services.ApiService,
  Services.AuthService,
  Services.ConfigService,
  Services.FullpathService,
  Services.DialogService,
  Services.AdminService,
  Services.BankService,
  Services.ClientService,
  Services.FileService,
  Services.GeneralService,
  Services.LoanService,
  Services.MenuService,
  Services.MerchantService,
  Services.NewsFeedService,
  Services.SavingDetailService,
  Services.SettingsService,
  Services.TarifService,
];

export const AllGuards = [
  Guards.AuthGuard,
  Guards.NoAuthGuard,
  Guards.authWorkstationGuard,
  Guards.bankingGuard,
  Guards.treasurerGuard,
  Guards.windowGuard,
  Guards.workstationGuard,
  Guards.PlateformGuard,
];

export const NonDiInterceptors = [
  Interceptors.clientInfoInterceptor,
  Interceptors.httpTokenInterceptor,
];
