import { Injectable } from '@angular/core';
import { ApiService } from '..';
import { BehaviorSubject, Observable } from 'rxjs';
import { MailModel } from '../../../components/settings/setting.model';

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

  getClientContact(
    clientId: number,
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
