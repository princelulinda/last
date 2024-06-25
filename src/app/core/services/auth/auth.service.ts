import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { DbService } from '../../db';
import { User, UserApiResponse } from '../../db/models';
import { ConfigService } from '../config/config.service';
import { UserInfoModel } from '../../db/models/auth';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //
  private userInfo$: Observable<UserInfoModel> | unknown;
  private userClientId$ = new Subject<number>();
  private userId$ = new Subject<number>();

  constructor(
    private apiService: ApiService,
    private dbService: DbService,
    private configService: ConfigService
  ) {
    this.userInfo$ = liveQuery(() => this.dbService.getOnce(User.tableName));
  }

  login(login_data: {
    username: string;
    password: string;
  }): Observable<object> {
    const loginData = { user: login_data };
    console.log('LOGIN DATA REQ : ', loginData);
    return this.apiService.post('/users/login/', loginData).pipe(
      map(data => {
        const userData = (data as { user: UserApiResponse }).user;
        // TODO : Save user data to indexeddb and save token to localStorage
        // this.dbService.setUser(userData);
        if (userData.token) {
          this.dbService.setLocalStorageUserToken(userData.token);
        }

        // console.log('LOGIN DATA SERVICE : ', data);
        return data;
      })
    );
  }

  getAuthToken(): string | null {
    const localToken = this.apiService.getLocalToken();
    return localToken;
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
      next: response => {
        console.info('LOGOUT RETURN INFO ::', response);
        this.configService.clearDB();
      },
      error: err => {
        console.error('LOGOUT ERROR', err);
      },
    });
  }

  populateClient() {
    return this.apiService.get('/client/user/populate/').pipe(
      map(data => {
        return data;
      })
    );
  }

  createAccount(body: object) {
    const url = '/client/';
    return this.apiService.post(url, body).pipe(map(response => response));
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
  getBanksList() {
    const url = '/banks/list/?externel_request=true&bank_type=MFI';
    return this.apiService.get(url).pipe(
      map(data => {
        return data;
      })
    );
  }

  verifyEmail(email: string) {
    const apiUrl = `/extid/verification/?externel_request=true&type=email&value=${email}`;
    return this.apiService.get(apiUrl).pipe(map(data => data));
  }

  verifyPhoneNumber(tel: string) {
    const apiUrl = `/extid/verification/?externel_request=true&type=phone_number&value=${tel}`;
    return this.apiService.get(apiUrl).pipe(map(data => data));
  }

  // METHOD FOR DATABASE DATA
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
}
