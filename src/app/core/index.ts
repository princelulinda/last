import * as Services from './services';
import * as Guards from './guards';
import * as Interceptors from './interceptors';

export const AllServices = [
  Services.ApiService,
  Services.AuthService,
  Services.DexieService,
  Services.FullpathService,
];

export const AllGuards = [
  Guards.AuthGuard,
  Guards.NoAuthGuard,
  Guards.bankingGuard,
  Guards.treasurerGuard,
  Guards.windowGuard,
  Guards.workstationGuard,
];

export const NonDiInterceptors = [
  Interceptors.clientInfoInterceptor,
  Interceptors.httpTokenInterceptor,
];
