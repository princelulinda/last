import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable, switchMap } from 'rxjs';

import {
  AuthService,
  ConfigService,
  DialogService,
  MenuService,
} from '../../../../core/services';
import { ConnectedOperatorModel, OrganizationModel } from '../../auth.model';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-auth-corporate',
  standalone: true,
  imports: [],
  templateUrl: './auth-corporate.component.html',
  styleUrl: './auth-corporate.component.scss',
})
export class AuthCorporateComponent implements OnInit {
  private operatorOrganizations$: Observable<OrganizationModel[]>;
  operatorOrganizations: OrganizationModel[] = [];
  operatorIsAuthenticated$: Observable<boolean>;
  dialog$: Observable<DialogResponseModel>;
  password = '';

  selectedOrganization!: OrganizationModel;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private menuService: MenuService,
    private router: Router
  ) {
    this.operatorIsAuthenticated$ =
      this.configService.operatorIsAuthenticated();
    this.operatorOrganizations$ = this.configService.getOperatorOrganizations();
    this.dialog$ = this.dialogService.getDialogState();
  }

  ngOnInit() {
    // NOTE :: WORKSTATION INITIALISATION
    this.dialogService.dispatchSplashScreen();
    this.operatorIsAuthenticated$.subscribe({
      next: state => {
        if (state) {
          this.router.navigate(['/w/workstation']);
        } else {
          this.getConnectedOperator_organizations();
        }
      },
    });

    // NOTE :: OTHER FONCTIONNALITY
    this.operatorOrganizations$.subscribe({
      next: organizations => {
        if (organizations) {
          this.operatorOrganizations = organizations;
        }
      },
    });
    this.dialog$.subscribe({
      next: dialog => {
        if (
          dialog.action === 'Organization login' &&
          dialog.response.password
        ) {
          this.password = dialog.response.password;
          this.loginCorporate();
        }
      },
    });
  }

  loginCorporate() {
    this.dialogService.dispatchLoading();
    const data: { organization_id: string; password: string } = {
      organization_id: this.selectedOrganization.id.toString(),
      password: this.password,
    };
    this.authService.loginCorporate(data).subscribe({
      next: () => {
        this.router.navigate(['/w/workstation']);
        this.dialogService.closeLoading();
      },
      error: err => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          message:
            err?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
          title: '',
          type: 'failed',
        });
      },
    });
  }

  private getConnectedOperator_organizations() {
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
          // NOTE :: IF OPERATOR IS ALLREADY CONNECTED
          if (response.operator.object.response_data.object) {
            const connectedOperator =
              response.operator.object.response_data.object;
            const operator: ConnectedOperatorModel = {
              organization: connectedOperator.organization,
              operator: {
                id: connectedOperator.operator.id,
                isTeller: connectedOperator.is_teller,
                isTreasurer: connectedOperator.is_treasurer,
              },
            };
            this.configService.setOperator(operator);
          }

          const organizations: OrganizationModel[] = [];
          response.organizations.objects.map(data => {
            organizations.push(data.organization);
          });
          this.configService.setOperatorOrganizations(organizations);
          this.dialogService.closeSplashScreen();
        },
      });
  }

  selectOrganization(data: OrganizationModel) {
    this.selectedOrganization = data;
    this.dialogService.openDialog({
      action: 'Organization login',
      message: $localize`Enter your password to add a new organisation`,
      title: '',
      type: 'password',
    });
  }
}
