import { Component, OnDestroy, OnInit } from '@angular/core';
import { BankingService } from '../../../core/services/dashboards/banking.service';
import { Subject, Observable, takeUntil } from 'rxjs';
import { ModeModel, ConfigService, AuthService } from '../../../core/services';
import { CommonModule, NgClass } from '@angular/common';
import { UserInfoModel } from '../../../core/db/models/auth';
import { RouterLink } from '@angular/router';
import { nyamuranziCard } from '../models';
import { userInfoModel } from '../../../layouts/header/model';

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
  referees!: nyamuranziCard;
  noRefereed = false;

  private userInfo$: Observable<UserInfoModel>;

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
  }

  toggleAmount() {
    this.showAmountAccount = !this.showAmountAccount;
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
