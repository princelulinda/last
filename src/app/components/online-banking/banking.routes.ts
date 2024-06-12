// banking.routes.ts

import { Routes } from '@angular/router';
import { TestLayout1Component } from './test-layout1/test-layout1.component';
import { TestLayout2Component } from './test-layout2/test-layout2.component';
import { BankingComponent } from '../layouts/banking/banking.component';

export const bankingRoutes: Routes = [
  {
    path: '',
    component: BankingComponent,

    children: [
      { path: 'test1', component: TestLayout1Component },
      { path: 'test2', component: TestLayout2Component },
    ],
  },
];
