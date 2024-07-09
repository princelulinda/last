import { Routes } from '@angular/router';
import { LoanHomeComponent } from './loan-home/loan-home.component';
import { LoanSimulatorComponent } from './loan-simulator/loan-simulator.component';

export const loanRoutes: Routes = [
  {
    path: '',
    component: LoanHomeComponent,
  },
  {
    path: 'simulator',
    component: LoanSimulatorComponent,
  },
];
