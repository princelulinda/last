import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import { connectedOperatorModel } from '../../auth.model';

@Component({
  selector: 'app-auth-corporate',
  standalone: true,
  imports: [],
  templateUrl: './auth-corporate.component.html',
  styleUrl: './auth-corporate.component.scss',
})
export class AuthCorporateComponent implements OnInit {
  organization: connectedOperatorModel | null = null;
  operatorIsAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.operatorIsAuthenticated$ =
      this.configService.operatorIsAuthenticated();
  }

  ngOnInit() {
    this.dialogService.dispatchSplashScreen();
    this.getOperatorOperator_organization();
    this.operatorIsAuthenticated$.subscribe({
      next: state => {
        if (state) {
          this.dialogService.closeDialog();
        } else {
          this.getConnectedOperator();
        }
      },
    });
  }

  getConnectedOperator() {
    this.authService.getConnectedOperator().subscribe({
      next: response => {
        const data = response.object.response_data.object;
        const operator: connectedOperatorModel = {
          organization: data.organization,
          operator: {
            id: data.operator.id,
            isTeller: data.operator.is_teller,
            isTreasurer: data.operator.is_treasurer,
          },
        };
        this.configService.setOperator(operator);
        this.dialogService.closeSplashScreen();
      },
      error: err => {
        console.log('Salut les gens', err);
      },
    });
  }

  getOperatorOperator_organization() {
    // code
  }
}
