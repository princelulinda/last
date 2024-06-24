import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { DbService } from '../../db';
import { UserApiResponse } from '../../db/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private dbService: DbService
  ) {}

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
        this.dbService.setLocalStorageUserToken(userData.token);

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
    return this.apiService.post('/users/logout/').pipe(
      map(data => {
        return data;
      })
    );
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
}
