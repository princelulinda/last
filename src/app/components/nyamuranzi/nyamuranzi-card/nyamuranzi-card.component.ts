import { Component, OnDestroy, OnInit } from '@angular/core';
import { BankingService } from '../../../core/services/dashboards/banking.service';
import { Subject, Observable, takeUntil } from 'rxjs';
import {
  ModeModel,
  ConfigService,
  AuthService,
  DialogService,
} from '../../../core/services';
import { CommonModule, NgClass } from '@angular/common';
import { UserInfoModel } from '../../../core/db/models/auth';
import { RouterLink } from '@angular/router';
import { nyamuranziCard } from '../models';
import { userInfoModel } from '../../../layouts/header/model';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

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
  clientId: number | null = null;
  showAmountAccount = false;
  referees!: nyamuranziCard;
  noRefereed = false;
  dialog$: Observable<DialogResponseModel>;
  private userInfo$: Observable<UserInfoModel>;

  constructor(
    private bankingService: BankingService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
    this.mode$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.dialog$ = this.dialogService.getDialogState();
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
        this.clientId = this.clientInfo.client.id;
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
  // copyReferalLink() {
  //   const reference = this.clipboardService.copyFromContent(
  //       window.location.origin + '/ihela/sign-up/' + this.clientId
  //   );

  //   if (reference) {
  //     this.dialogService.openToast({
  //       type: 'success',
  //       title: 'Success',
  //       message:
  //         $localize`Referal link copied to clipboard`,
  //     });

  //   }
  // }
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
