import { Component, OnInit } from '@angular/core';

import { map, Observable, switchMap } from 'rxjs';

import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import { ConnectedOperatorModel, OrganizationModel } from '../../auth.model';

@Component({
  selector: 'app-auth-corporate',
  standalone: true,
  imports: [],
  templateUrl: './auth-corporate.component.html',
  styleUrl: './auth-corporate.component.scss',
})
export class AuthCorporateComponent implements OnInit {
  private operatorOrganizations$: Observable<OrganizationModel[]>;
  operatorOrganizations: OrganizationModel[] | [] = [];
  operatorIsAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.operatorIsAuthenticated$ =
      this.configService.operatorIsAuthenticated();
    this.operatorOrganizations$ = this.configService.getOperatorOrganizations();
  }

  ngOnInit() {
    // NOTE :: WORKSTATION INITIALISATION
    this.dialogService.dispatchSplashScreen();
    this.operatorIsAuthenticated$.subscribe({
      next: state => {
        if (state) {
          this.dialogService.closeSplashScreen();
        } else {
          this.getOperatorOperator_organization();
        }
      },
    });

    // NOTE :: OTHER FONCTIONNALITY
    this.operatorOrganizations$.subscribe({
      next: organizations => {
        this.operatorOrganizations = organizations;
      },
    });
  }

  getOperatorOperator_organization() {
    this.authService
      .getConnectedOperator()
      .pipe(
        switchMap(operator =>
          this.authService.getOperatorOrganizations().pipe(
            map(data => {
              return { operator: operator, organizations: data };
            })
          )
        )
      )
      .subscribe({
        next: response => {
          const connectedOperator =
            response.operator.object.response_data.object;
          const organizations: OrganizationModel[] = [];
          response.organizations.objects.map(data => {
            organizations.push(data.organisation);
          });

          const operator: ConnectedOperatorModel = {
            organization: connectedOperator.organization,
            operator: {
              id: connectedOperator.operator.id,
              isTeller: connectedOperator.operator.is_teller,
              isTreasurer: connectedOperator.operator.is_treasurer,
            },
          };
          this.configService.setOperator(operator);
          this.configService.setOperatorOrganizations(organizations);
          this.dialogService.closeSplashScreen();
        },
      });
  }
}
