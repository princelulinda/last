import * as Services from './services';
import * as Guards from './guards';
import * as Interceptors from './interceptors';

export const AllServices = [
  Services.ApiService,
  Services.AuthService,
  Services.ConfigService,
  Services.FullpathService,
  Services.DialogService,
];

export const AllGuards = [
  Guards.AuthGuard,
  Guards.NoAuthGuard,
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
