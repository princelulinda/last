import * as Services from './services';
import * as Guards from './guards';
import * as Interceptors from './interceptors';

export const AllServices = [Services.ApiService, Services.AuthService];
export const AllGuards = [
  Guards.authGuard,
  Guards.noAuthGuard,
  Guards.bankingGuard,
  Guards.treasurerGuard,
  Guards.windowGuard,
  Guards.workstationGuard,
];
export const NonDiInterceptors = [
  Interceptors.clientInfoInterceptor,
  Interceptors.httpTokenInterceptor,
];
