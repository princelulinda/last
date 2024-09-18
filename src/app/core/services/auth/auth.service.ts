import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { liveQuery } from 'dexie';

import { ApiService } from '../api/api.service';
import { DbService } from '../../db';
import {
  EmailVerificationResponseModel,
  CreateAccountResponseModel,
  PhoneNumberVerificaitonResponseModel,
  ResetPasswordResponseModel,
  OtpVerificationResponseModel,
  ConectedOperatorApiResponseModel,
  OrganizationModel,
  LoginOperatorApiResponseModel,
  OrganizationInvitationModel,
  CreateAccountBodyModel,
  ResetPasswordBodyModel,
  OtpVerificationBodyModel,
  SubmitInvitationResponseModel,
} from '../../../components/auth/auth.model';
import { User, UserApiResponse } from '../../db/models';
import { ConfigService } from '../config/config.service';
import { UserInfoModel } from '../../db/models/auth';
import { DialogService } from '../dialog/dialog.service';
import { PlateformModel } from '../config/main-config.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfo$: Observable<UserInfoModel> | unknown;
  private userClientId$ = new Subject<number>();
  private userId$ = new Subject<number>();
  private userIsAgent$ = new Subject<boolean>();
  private userUnchangedClientId$ = new Subject<number>();
  private userUnchangedId$ = new Subject<number>();

  constructor(
    private apiService: ApiService,
    private dbService: DbService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.userInfo$ = liveQuery<UserInfoModel>(async () =>
      this.dbService.getOnce(User.tableName)
    );
  }

  login(login_data: {
    username: string;
    password: string;
  }): Observable<object> {
    const loginData = { user: login_data };
    return this.apiService.post<object>('/users/login/', loginData).pipe(
      map(data => {
        const userData = (data as { user: UserApiResponse }).user;
        if (userData.token) {
          this.dbService.setLocalStorageUserToken(userData.token);
        }
        return data;
      })
    );
  }

  isAuthenticated(): boolean {
    const localToken = this.apiService.getLocalToken();
    return localToken !== null;
  }

  getOperatorOrganizations(): Observable<{
    objects:
      | {
          id: number;
          operator: object;
          organization: OrganizationModel;
        }[]
      | [];
    count: number;
  }> {
    return this.apiService
      .get<{
        objects:
          | {
              id: number;
              operator: object;
              organization: OrganizationModel;
            }[]
          | [];
        count: number;
      }>('/hr/access/operator/organizations/?populate=true')
      .pipe(map(data => data));
  }

  getConnectedOperator(): Observable<ConectedOperatorApiResponseModel> {
    return this.apiService
      .get<ConectedOperatorApiResponseModel>('/hr/connected/operator/')
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  loginCorporate(login_data: {
    organization_id: string;
    password: string;
  }): Observable<LoginOperatorApiResponseModel> {
    return this.apiService
      .post<LoginOperatorApiResponseModel>(
        '/hr/organization/login/',
        login_data
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  logoutCorporate() {
    return this.apiService.get('/hr/organization/logout/').pipe(
      map(data => {
        return data;
      })
    );
  }

  logout() {
    this.dialogService.dispatchLoading();
    this.apiService.post('/users/logout/').subscribe({
      next: async () => {
        await this.configService.clearDB();
        // this.configService.switchPlateform('authentification');
        window.location.reload();
        this.dialogService.closeLoading();
      },
      error: err => {
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          message:
            err?.response_message ??
            'Something went wrong, please retry again!',
          title: '',
          type: 'failed',
        });
      },
    });
  }

  populateClient(Router: Router, switchOn: PlateformModel = 'onlineBanking') {
    this.dialogService.dispatchSplashScreen();
    this.apiService
      .get<{ object: UserInfoModel }>('/client/user/populate/')
      .subscribe({
        next: data => {
          const populateData = data.object;
          const userInfo: UserInfoModel =
            this.formatPopulateClientData(populateData);
          this.dbService.setUser(userInfo);
          this.configService.switchPlateform(switchOn);
          this.dialogService.closeSplashScreen();
        },
        error: err => {
          this.apiService.clearLocalData();
          this.dialogService.closeSplashScreen();
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

  private formatPopulateClientData(data: UserInfoModel): UserInfoModel {
    return {
      user: {
        username: data.user.username,
        token: data.user.token,
        fcm_data: {},
        device_data: {},
      },
      client: {
        id: data.client.id,
        client_id: data.client.client_id,
        client_code: data.client.client_code,
        client_email: data.client.client_email,
        client_full_name: data.client.client_full_name,
        client_phone_number: data.client.client_phone_number,
        client_type: data.client.client_type,
        has_pin: data.client.has_pin,
        is_agent: data.client.is_agent,
        is_merchant: data.client.is_merchant,
        is_partner_bank: data.client.is_partner_bank,
        picture: data.client.picture_url,
        picture_url: '',
        prefered_language: data.client.prefered_language,
      },
    };
  }

  createAccount(
    body: CreateAccountBodyModel
  ): Observable<CreateAccountResponseModel> {
    const url = '/client/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as CreateAccountResponseModel));
  }

  requestOTP(
    body: ResetPasswordBodyModel
  ): Observable<ResetPasswordResponseModel> {
    const url = '/otp/request/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as ResetPasswordResponseModel));
  }
  OTPverification(
    body: OtpVerificationBodyModel
  ): Observable<OtpVerificationResponseModel> {
    const url = '/otp/verification/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as OtpVerificationResponseModel));
  }

  getOperatorInvitations(
    clientId: number
  ): Observable<{ objects: OrganizationInvitationModel[]; count: number }> {
    const url = `/hr/operator/organizations/manage/?list_type=invitations&access_bank_id=${clientId}`;
    return this.apiService
      .get<{ objects: OrganizationInvitationModel[]; count: number }>(url)
      .pipe(map(data => data));
  }

  submitInvitationStatus(body: {
    status: string;
    operator: number;
    pin_code: string;
  }): Observable<{ object: SubmitInvitationResponseModel; count: number }> {
    const url = '/hr/administration/operator/organization/status/';
    return this.apiService
      .post(url, body)
      .pipe(
        map(
          data =>
            data as { object: SubmitInvitationResponseModel; count: number }
        )
      );
  }

  verifyEmail(email: string): Observable<EmailVerificationResponseModel> {
    const url = `/extid/verification/?externel_request=true&type=email&value=${email}`;
    return this.apiService.get(url);
  }

  verifyPhoneNumber(
    tel: string
  ): Observable<PhoneNumberVerificaitonResponseModel> {
    const url = `/extid/verification/?externel_request=true&type=phone_number&value=${tel}`;
    return this.apiService.get(url);
  }

  passwordVerification(password: string) {
    const url = '/client/password-verification/';
    return this.apiService
      .post(url, { password })
      .pipe(map(response => response));
  }

  // METHOD FOR USSER DATABASE DATA
  getUserInfo(): Observable<UserInfoModel> {
    return this.userInfo$ as Observable<UserInfoModel>;
  }

  getUserClientId(): Observable<number> {
    const localPlateform: PlateformModel = this.getLocalPlateform();
    if (localPlateform !== 'workstation') {
      this.getUserInfo().subscribe({
        next: userInfo => {
          if (userInfo) {
            this.userClientId$.next(userInfo.client.client_id);
          }
        },
      });
    } else {
      this.configService.getConnectedOperator().subscribe({
        next: response => {
          if (response && response.organization) {
            this.userClientId$.next(
              response.organization.institution_client.id
            );
          }
        },
      });
    }
    return this.userClientId$;
  }

  checkUserIsAgent(): Observable<boolean> {
    this.getUserInfo().subscribe({
      next: userInfo => {
        if (userInfo) {
          this.userIsAgent$.next(userInfo.client.is_agent);
        }
      },
    });
    return this.userIsAgent$;
  }

  getUserId(): Observable<number> {
    const localPlateform: PlateformModel = this.getLocalPlateform();
    if (localPlateform !== 'workstation') {
      this.getUserInfo().subscribe({
        next: userInfo => {
          if (userInfo) {
            this.userId$.next(userInfo.client.id);
          }
        },
      });
    } else {
      this.configService.getConnectedOperator().subscribe({
        next: response => {
          if (response && response.organization) {
            this.userClientId$.next(
              response.organization.institution_client.id
            );
          }
        },
      });
    }

    return this.userId$;
  }

  getAlwaysUserId(): Observable<number> {
    this.getUserInfo().subscribe({
      next: userInfo => {
        if (userInfo) {
          this.userUnchangedId$.next(userInfo.client.id);
        }
      },
    });
    return this.userUnchangedId$;
  }
  getAlwaysUserClientId(): Observable<number> {
    this.getUserInfo().subscribe({
      next: userInfo => {
        if (userInfo) {
          this.userUnchangedClientId$.next(userInfo.client.client_id);
        }
      },
    });
    return this.userUnchangedClientId$;
  }

  // METHOD FOR GET LOCAL DATA
  getLocalAuthToken(): string | null {
    const localToken = this.apiService.getLocalToken();
    return localToken;
  }
  getLocalClientId(): string | null {
    return this.apiService.getLocalClientId();
  }
  getLocalBankId(): string | null {
    return this.apiService.getLocalBankId();
  }
  getLocalPlateform(): PlateformModel {
    return this.apiService.getLocalPlateform();
  }
}
