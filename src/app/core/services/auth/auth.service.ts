import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { liveQuery } from 'dexie';

import { ApiService } from '../api/api.service';
import { DbService } from '../../db';
import {
  EmailVerificationResponse,
  createAccountResponse,
  phoneNumberVerificaitonResponse,
  bankListResponse,
} from '../../../components/auth/auth.model';
import { User, UserApiResponse } from '../../db/models';
import { ConfigService } from '../config/config.service';
import { UserInfoModel } from '../../db/models/auth';
import { DialogService } from '../dialog/dialog.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfo$: Observable<UserInfoModel> | unknown;
  private userClientId$ = new Subject<number>();
  private userId$ = new Subject<number>();

  constructor(
    private apiService: ApiService,
    private dbService: DbService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.userInfo$ = liveQuery(() => this.dbService.getOnce(User.tableName));
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

  populate() {
    return this.apiService
      .get('/hr/access/operator/organizations/?populate=true')
      .pipe(map(data => data));
  }

  getConnectedOperator() {
    return this.apiService.get('/hr/connected/operator/').pipe(
      map(data => {
        return data;
      })
    );
  }

  loginCorporate(login_data: { organization_id: string; password: string }) {
    return this.apiService.post('/hr/organization/login/', login_data).pipe(
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
    this.apiService.post('/users/logout/').subscribe({
      next: () => {
        this.configService.clearDB();
      },
      error: err => {
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

  populateClient(): Observable<UserInfoModel> {
    return this.apiService.get<UserInfoModel>('/client/user/populate/').pipe(
      map(data => {
        if (data) {
          const populate = data;
          const userDB = this.populateClientFormat(populate);
          this.dbService.setUser(userDB);
        }
        return data;
      })
    );
  }

  private populateClientFormat(populate: UserInfoModel): UserInfoModel {
    return {
      user: {
        username: populate.user.username,
        token: populate.user.token,
        fcm_data: {},
        device_data: {},
      },
      client: {
        id: populate.client.id,
        client_id: populate.client.client_id,
        client_code: populate.client.client_code,
        client_email: populate.client.client_email,
        client_full_name: populate.client.client_full_name,
        client_phone_number: populate.client.client_phone_number,
        client_type: populate.client.client_type,
        has_pin: populate.client.has_pin,
        is_agent: populate.client.is_agent,
        is_merchant: populate.client.is_merchant,
        is_partner_bank: populate.client.is_partner_bank,
        picture_url: populate.client.picture_url,
        prefered_language: populate.client.prefered_language,
      },
    };
  }

  createAccount(body: object): Observable<createAccountResponse> {
    const url = '/client/';
    // return this.apiService.post(url, body).pipe(map(response => response));
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as createAccountResponse));
  }

  requestOTP(body: object) {
    const url = '/otp/request/';
    return this.apiService.post(url, body).pipe(map(response => response));
  }
  OTPverification(body: object) {
    const url = '/otp/verification/';
    return this.apiService.post(url, body).pipe(map(response => response));
  }

  getOperatorInvitations(clientId: string) {
    const url = `/hr/operator/organizations/manage/?list_type=invitations&access_bank_id=${clientId}`;
    return this.apiService.get(url).pipe(map(data => data));
  }
  submitInvitationStatus(body: object) {
    const url = '/hr/administration/operator/organization/status/';
    return this.apiService.post(url, body).pipe(map(data => data));
  }
  // getBanksList():Observable<bankListResponse> {
  //   const url = '/banks/list/?externel_request=true&bank_type=MFI';
  //   return this.apiService.get(url);

  // }

  getBanksList(): Observable<{ objects: bankListResponse[] }> {
    const url = '/banks/list/?externel_request=true&bank_type=MFI';
    return this.apiService.get<{ objects: bankListResponse[] }>(url);
  }

  verifyEmail(email: string): Observable<EmailVerificationResponse> {
    const url = `/extid/verification/?externel_request=true&type=email&value=${email}`;
    return this.apiService.get(url);
  }

  verifyPhoneNumber(tel: string): Observable<phoneNumberVerificaitonResponse> {
    const url = `/extid/verification/?externel_request=true&type=phone_number&value=${tel}`;
    return this.apiService.get(url);
  }

  // METHOD FOR USSER DATABASE DATA
  getUserInfo(): Observable<UserInfoModel> {
    return this.userInfo$ as Observable<UserInfoModel>;
  }

  getUserClientId(): Observable<number> {
    this.getUserInfo().subscribe({
      next: userInfo => {
        this.userClientId$.next(userInfo.client.client_id);
      },
    });
    return this.userClientId$;
  }

  getUserId(): Observable<number> {
    this.getUserInfo().subscribe({
      next: userInfo => {
        this.userId$.next(userInfo.client.id);
      },
    });
    return this.userId$;
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
  getLocalPlateform(): string {
    return this.apiService.getLocalPlateform();
  }
}
