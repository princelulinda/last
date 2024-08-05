import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

import { Subject, Observable, takeUntil } from 'rxjs';

import { BankingService } from '../../../core/services/dashboards/banking.service';
import {
  ConfigService,
  AuthService,
  DialogService,
} from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { nyamuranziCard } from '../models';
import { userInfoModel } from '../../../layouts/header/model';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-nyamuranzi-card',
  standalone: true,
  imports: [NgClass, CommonModule, RouterLink],
  templateUrl: './nyamuranzi-card.component.html',
  styleUrl: './nyamuranzi-card.component.scss',
})
export class NyamuranziCardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  userInfo!: userInfoModel;
  clientInfo!: UserInfoModel;
  showAmountAccount = false;
  showAmountAccount$!: Observable<boolean>;
  referees!: nyamuranziCard;
  noRefereed = false;
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  private userInfo$: Observable<UserInfoModel>;

  constructor(
    private bankingService: BankingService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
    this.showAmountAccount$ = this.dialogService.getAmountState();
  }
  ngOnInit(): void {
    this.mainConfig$.subscribe({
      next: configs => {
        this.activePlatform = configs.activePlateform;
      },
    });

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

    this.bankingService
      .getRefereePersons()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.referees = data.object;
          if (!data.object.success) {
            this.noRefereed = true;
          }
        },
        error: () => {
          // code
        },
      });

    this.showAmountAccount$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: state => (this.showAmountAccount = state),
    });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
