import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankingService } from '../../../core/services/dashboards/banking.service';
import { Subject, Observable, takeUntil } from 'rxjs';
import { AuthService, ConfigService } from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';

import { NgClass, CommonModule } from '@angular/common';
import { WalletCard } from '../wallet.models';
import { userInfoModel } from '../../../layouts/header/model';
import { ModeModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-wallet-card',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './wallet-card.component.html',
  styleUrl: './wallet-card.component.scss',
})
export class WalletCardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  showAmountWallet = false;

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  private userInfo$: Observable<UserInfoModel>;

  defaultWallet!: WalletCard;
  noWalletData = false;

  constructor(
    private bankingService: BankingService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
  }
  ngOnInit(): void {
    this.mode$.subscribe({
      next: datas => {
        this.mode = datas;
      },
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        this.clientInfo = userinfo;
      },
    });
    this.getDefaultWallet();
  }

  toggleAmount() {
    this.showAmountWallet = !this.showAmountWallet;
  }
  getDefaultWallet() {
    this.bankingService
      .getDefaultWallet()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: defaultWallet => {
          this.defaultWallet = defaultWallet.object;

          if (defaultWallet.object.success === false) {
            this.noWalletData = true;
          }
        },
      });
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
