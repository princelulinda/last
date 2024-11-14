import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  ConfigService,
  DialogService,
  LoanService,
} from '../../../../../core/services';
import { DialogResponseModel } from '../../../../../core/services/dialog/dialogs-models';
import {
  CreditLineModel,
  CreditLineResponseDataModel,
} from '../credit-line.models';
import { AmountVisibilityComponent } from '../../../../../global/components/custom-field/amount-visibility/amount-visibility.component';
import { ProfileCardComponent } from '../../../../../global/components/custom-field/profile-card/profile-card.component';
import { ModeModel } from '../../../../../core/services/config/main-config.models';

@Component({
  selector: 'app-credit-line-details',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    AmountVisibilityComponent,
    ProfileCardComponent,
  ],
  templateUrl: './credit-line-details.component.html',
  styleUrl: './credit-line-details.component.scss',
})
export class CreditLineDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  lineId!: number;
  creditLine!: CreditLineModel | null;
  creditId!: number;
  creditLineRequest!: CreditLineResponseDataModel;
  isLoading = false;
  dialog$: Observable<DialogResponseModel>;
  dialog!: DialogResponseModel;
  action!: string;
  theme!: ModeModel;
  theme$: Observable<ModeModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService,
    private dialogService: DialogService,
    private configService: ConfigService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
    this.theme$ = this.configService.getMode();
  }

  ngOnInit(): void {
    this.theme$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: theme => {
        this.theme = theme;
      },
    });
    if (this.route.params) {
      this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe({
        next: params => {
          this.lineId = params['id'];
          this.getCreditsLineDetails();
        },
      });
    }
    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: dialog => {
        this.dialog = dialog;
        if (this.dialog && this.dialog.response) {
          if (
            this.dialog.response.password &&
            (this.dialog.action === 'authorize' ||
              this.dialog.action === 'cancel')
          ) {
            this.approveOrCancelCreditLine();
          }
        }
      },
    });
  }

  getCreditsLineDetails() {
    this.loanService
      .getCreditLineDetails(this.lineId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.creditLine = data.object;
          this.creditId = this.creditLine.id;

          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  refreshPage() {
    this.creditLine = null;
    this.getCreditsLineDetails();
  }

  approveOrCancelCreditLine() {
    const change_status = {
      request_type: this.action,
      password: this.dialog.response.password,
      credit_line: this.creditId,
    };
    this.dialogService.dispatchLoading();
    this.loanService
      .approveOrCancelCreditLine(change_status)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: data => {
          this.creditLineRequest = data.object;
          this.dialogService.closeLoading();
          this.dialog.response.password = '';
          if (data.object.success === true) {
            this.getCreditsLineDetails();
            this.dialogService.openToast({
              title: '',
              type: 'success',
              message: data.object.response_message,
            });
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: data.object.response_message,
            });
          }
        },
        error: error => {
          this.isLoading = false;
          this.dialogService.closeLoading();
          if (error.object.response_message) {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: error.object.response_message,
            });
          } else if (error.object.detail) {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: error.object.detail,
            });
          } else {
            this.dialogService.openToast({
              title: '',
              type: 'failed',
              message: 'An error occured, please try again later',
            });
          }
        },
      });
  }

  getActionSelected(action: string) {
    this.action = action;
    if (action === 'authorize') {
      this.dialogService.openDialog({
        title: '',
        type: 'password',
        message: 'Authorize Credit Line',
        action: 'authorize',
      });
    } else if (action === 'cancel') {
      this.dialogService.openDialog({
        title: '',
        type: 'password',
        message: 'Cancel Credit Line',
        action: 'cancel',
      });
    }
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  goBack() {
    this.router.navigate(['/w/workstation/d/desk/credit/creditsline/list']);
  }
}
