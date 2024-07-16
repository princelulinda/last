import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  activeMainConfigModel,
  AuthService,
  ConfigService,
} from '../../../core/services';
import { ClientService } from '../../../core/services/client/client.service';
import { UserInfoModel } from '../../../core/db/models/auth';
import { accountsList } from '../models';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit {
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  private userInfo$: Observable<UserInfoModel>;
  clientInfo!: UserInfoModel;
  clientId!: number;
  isLoading = false;
  accountsOnlineBanking: accountsList[] | [] | null = null;
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService
    // private location: Location
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        if (this.clientId) {
          this.getClientAccountsOnlineBanking();
        }
      },
    });
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }

  getClientAccountsOnlineBanking() {
    this.isLoading = true;
    this.clientService.getClientAccounts(this.clientId).subscribe({
      next: response => {
        this.accountsOnlineBanking = response.objects;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur :', err);
        this.isLoading = false;
      },
    });
  }
}
