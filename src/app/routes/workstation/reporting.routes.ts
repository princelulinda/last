import { Routes } from '@angular/router';
import { LedgerReportsComponent } from '../../components/reports/ledger-reports/ledger-reports.component';

export const ReportingRoutes: Routes = [
  {
    path: 'ledger_reports',
    component: LedgerReportsComponent,
  },
  {
    path: 'access-required',
    loadComponent: () =>
      import(
        '../../global/components/errors/forbidden-403/forbidden-403.component'
      ).then(m => m.Forbidden403Component),
  },
];
