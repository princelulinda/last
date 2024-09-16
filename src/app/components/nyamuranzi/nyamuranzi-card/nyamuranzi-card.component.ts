import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

import { Subject, Observable, takeUntil } from 'rxjs';

import {
  ConfigService,
  AuthService,
  BankService,
} from '../../../core/services';
import { UserInfoModel } from '../../../core/db/models/auth';
import { nyamuranziCardModel } from '../nyamuranzi.models';
import {
  activeMainConfigModel,
  ModeModel,
} from '../../../core/services/config/main-config.models';
import { AmountVisibilityComponent } from '../../../global/components/custom-field/amount-visibility/amount-visibility.component';

@Component({
  selector: 'app-nyamuranzi-card',
  standalone: true,
  imports: [NgClass, CommonModule, RouterLink, AmountVisibilityComponent],
  templateUrl: './nyamuranzi-card.component.html',
  styleUrl: './nyamuranzi-card.component.scss',
})
export class NyamuranziCardComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();

  mode!: ModeModel;
  mode$!: Observable<ModeModel>;
  clientInfo!: UserInfoModel;
  referees!: nyamuranziCardModel;
  noRefereed = false;
  activePlatform: string | null = null;
  mainConfig$!: Observable<activeMainConfigModel>;
  private userInfo$: Observable<UserInfoModel>;

  constructor(
    private bankService: BankService,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.mainConfig$ = this.configService.getMainConfig();
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
        if (userinfo) {
          this.clientInfo = userinfo;
        }
      },
    });

    this.bankService
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
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
