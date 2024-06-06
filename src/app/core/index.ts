import * as Services from './services';
import * as Guards from './guards';

export const AllServices = [Services.ApiService, Services.AuthService];
export const AllGuards = [
  Guards.authGuard,
  Guards.bankingGuard,
  Guards.treasurerGuard,
  Guards.windowGuard,
  Guards.workstationGuard,
];
