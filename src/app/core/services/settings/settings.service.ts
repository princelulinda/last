import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  MailModel,
  PasswordChangeResponseModel,
  PasswordModel,
  PinChangeResponseModel,
} from '../../../components/settings/settings.models';
import { PinModel } from '../../../components/settings/settings.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  //
  private _isSetting: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isSetting$(): Observable<boolean> {
    return this._isSetting.asObservable();
  } //

  private _selectedSubMenu: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  get selectedSubMenu$(): Observable<string> {
    return this._selectedSubMenu.asObservable();
  } //

  constructor(private apiService: ApiService) {
    //
  }

  handleTransfer(arg: boolean) {
    this._isSetting.next(arg);
  }

  selectSubMenu(menu: string) {
    this._selectedSubMenu.next(menu);
  }

  changePin(body: PinModel): Observable<PinChangeResponseModel> {
    const url = '/client/change-pin/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as PinChangeResponseModel));
  }

  changePassword(body: PasswordModel): Observable<PasswordChangeResponseModel> {
    const url = '/client/change-password/';
    return this.apiService
      .post(url, body)
      .pipe(map(response => response as PasswordChangeResponseModel));
  }

  getClientContact(
    clientId: number | string,
    contactType: string
  ): Observable<{ objects: MailModel[] }> {
    let url = '';
    if (contactType === 'phoneNumber') {
      url = `/client/extid/?client=${clientId}&id_type=P`;
    } else if (contactType === 'email') {
      url = `/client/extid/?client=${clientId}&id_type=E`;
    }
    return this.apiService.get<{ objects: MailModel[] }>(url);
  }
}
