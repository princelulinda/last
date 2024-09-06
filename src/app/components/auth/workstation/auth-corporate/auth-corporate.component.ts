import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';

import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../../core/services';
import {
  ConnectedOperatorModel,
  OrganizationInvitationModel,
  OrganizationModel,
} from '../../auth.model';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-auth-corporate',
  standalone: true,
  imports: [],
  templateUrl: './auth-corporate.component.html',
  styleUrl: './auth-corporate.component.scss',
})
export class AuthCorporateComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  private operatorOrganizations$: Observable<OrganizationModel[]>;
  operatorOrganizations: OrganizationModel[] = [];
  operatorIsAuthenticated$: Observable<boolean>;
  dialog$: Observable<DialogResponseModel>;
  password = '';
  clientId$!: Observable<number>;
  userId!: number;
  invitations!: OrganizationInvitationModel[];
  loadingInvitations = true;
  invitationAction = '';
  pin = '';
  selectedInvitation!: { id: number };

  selectedOrganization!: OrganizationModel;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.operatorIsAuthenticated$ =
      this.configService.operatorIsAuthenticated();
    this.operatorOrganizations$ = this.configService.getOperatorOrganizations();
    this.dialog$ = this.dialogService.getDialogState();
    this.clientId$ = this.authService.getUserId();
  }

  ngOnInit() {
    // NOTE :: WORKSTATION INITIALISATION
    this.dialogService.dispatchSplashScreen();
    this.operatorIsAuthenticated$.subscribe({
      next: state => {
        if (state) {
          this.configService.setLocalConnectedOperator('true');
          this.router.navigate(['/w/workstation']);
        } else {
          this.configService.setLocalConnectedOperator('false');
          // TODO :: TO CALL AFTER CHECK ORGANIZATIONS AND OPERATOR EMPTY IN DB
          this.getConnectedOperator_organizations();
        }
      },
    });
    // NOTE :: OTHER FONCTIONNALITY
    this.operatorOrganizations$.subscribe({
      next: organizations => {
        if (organizations) {
          this.operatorOrganizations =
            this.configService.toArray(organizations);
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
        } else if (
          dialog.action === 'accept or decline invitation' &&
          dialog.response.pin
        ) {
          this.pin = dialog.response.pin;
          this.submitInvitationStatus();
        }
      },
    });

    this.clientId$.subscribe({
      next: id => {
        this.userId = id;
        if (this.userId) {
          this.getOperatorInvitations();
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
      next: response => {
        const operator: ConnectedOperatorModel = {
          organization: response.object.response_data.organization,
          operator: {
            id: response.object.response_data.operator.id,
            isTeller: response.object.response_data.is_teller,
            isTreasurer: response.object.response_data.is_treasurer,
          },
        };
        this.configService.setOperator(operator);
        this.configService.setLocalConnectedOperator('true');
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
          const organizations: OrganizationModel[] = [];
          response.organizations.objects.map(data => {
            organizations.push(data.organization);
          });
          this.configService.setOperatorOrganizations(organizations);

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
          } else {
            this.dialogService.closeSplashScreen();
          }
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

  getOperatorInvitations() {
    this.authService
      .getOperatorInvitations(this.userId.toString())
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const response = result as { objects: OrganizationInvitationModel[] };
          this.invitations = response.objects;
          this.loadingInvitations = false;
        },
        error: err => {
          this.loadingInvitations = false;
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              err?.error?.object.response_message ??
              'Failed to get invitations ',
          });
        },
      });
  }
  submitInvitationResponse(
    action: string,
    operator: OrganizationInvitationModel
  ) {
    this.invitationAction = action;
    this.selectedInvitation = operator;
    this.dialogService.openDialog({
      title: 'Enter your pin',
      type: 'pin',
      message: 'Enter your pin to confirm your decision',
      action: 'accept or decline invitation',
    });
  }
  submitInvitationStatus() {
    const body = {
      status:
        this.invitationAction === 'accept'
          ? 'C'
          : this.invitationAction === 'decline'
            ? 'R'
            : '',
      operator: this.selectedInvitation.id,
      pin_code: this.pin,
    };
    this.dialogService.dispatchLoading();
    this.authService
      .submitInvitationStatus(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: result => {
          const response = result as {
            object: { success: string; response_message: string };
          };
          this.dialogService.closeLoading();
          if (
            response.object['success'] !== undefined &&
            !response.object.success
          ) {
            this.dialogService.openToast({
              title: 'failed',
              type: 'failed',
              message: response.object.response_message,
            });
            return;
          }
          this.dialogService.openToast({
            title: 'success',
            type: 'success',
            message: response.object.response_message,
          });
          this.getOperatorInvitations();
          this.getConnectedOperator_organizations();
        },
        error: err => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            title: '',
            type: 'failed',
            message:
              err?.error?.object.response_message ??
              'Failed to submit your invitation ',
          });
        },
      });
  }
}
