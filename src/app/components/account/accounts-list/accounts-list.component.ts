import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  activeMainConfigModel,
  AuthService,
  ConfigService,
} from '../../../core/services';
import { ClientService } from '../../../core/services/client/client.service';

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

  // walletsOnlineBanking: WalletList[] | [] | null = null;
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService,
    private location: Location
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    // this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
  }
}
