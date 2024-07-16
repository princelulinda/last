import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService, activeMainConfigModel } from '../../../core/services';
import { Observable, Subject } from 'rxjs';
import { UserInfoModel } from '../../../core/db/models/auth';
import { AuthService } from '../../../core/services';
import { ClientService } from '../../../core/services/client/client.service';
import { WalletList } from '../models';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-wallet-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wallet-list.component.html',
  styleUrl: './wallet-list.component.scss',
})
export class WalletListComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  mainConfig$!: Observable<activeMainConfigModel>;
  mainConfig!: activeMainConfigModel;
  clientInfo!: UserInfoModel;
  isLoneWalletSelected = false;
  private userInfo$: Observable<UserInfoModel>;
  isLoading = false;
  clientId!: number;
  selectedWallet!: WalletList;
  wallet!: WalletList;
  //selected Wallet for medium and small screens
  selectedLoneWallet!: WalletList;

  isWalletDetailsShown = false;
  walletsOnlineBanking: WalletList[] | [] | null = null;
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private clientService: ClientService,
    private location: Location
  ) {
    this.mainConfig$ = this.configService.getMainConfig();
    this.userInfo$ = this.authService.getUserInfo();
  }
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.mainConfig = configs;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
        this.clientId = this.clientInfo.client.id;
        if (this.clientId) {
          this.getClientWalletsOnlineBanking();
        }
      },
    });

    this.clientService.isDetailsWalletShown$.subscribe((response: boolean) => {
      this.isWalletDetailsShown = response;
    });
  }

  getClientWalletsOnlineBanking() {
    this.isLoading = true;
    this.clientService.getWallets(this.clientId).subscribe({
      next: response => {
        this.walletsOnlineBanking = response.objects;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur :', err);
        this.isLoading = false;
      },
    });
  }

  selectLoneWallet(wallet: WalletList) {
    this.selectedLoneWallet = wallet;
    this.isLoneWalletSelected = true;
    this.isLoading = false;

    this.selectedWallet = wallet;
  }

  selectWallet(wallet: WalletList) {
    this.isLoading = false;
    this.selectedWallet = wallet;
  }

  goBack() {
    this.location.back();
    this.isLoneWalletSelected = false;
  }
  refresh() {
    //  this.walletsOnlineBanking = []; // Initialize as an empty array
    this.isLoading = true;
    this.getClientWalletsOnlineBanking();
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
