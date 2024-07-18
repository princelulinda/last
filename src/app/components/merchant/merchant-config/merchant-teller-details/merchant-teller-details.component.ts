import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../../../../global/components/loaders/skeleton/skeleton.component';
import { tellerObjectModel } from '../../merchant.models';
import { DialogService } from '../../../../core/services';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-merchant-teller-details',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './merchant-teller-details.component.html',
  styleUrl: './merchant-teller-details.component.scss',
})
export class MerchantTellerDetailsComponent implements OnInit {
  @Input() tellerInfo!: tellerObjectModel;
  //   @Output() isActionDone: EventEmitter<boolean> = new EventEmitter();

  canReceiveNotifications = false;
  action = '';
  dialog!: DialogResponseModel;
  dialog$: Observable<DialogResponseModel>;
  actionMessage = '';
  // theme = '';
  // theme$!: Observable<string>;

  isActive = true;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private dialogService: DialogService) {
    //   private merchantService: MerchantService,
    // private store: Store,
    // private variableService: VariableService
    //
    this.dialog$ = this.dialogService.getDialogState();
    // this.theme$ = this.store.select(SwitchThemeState.GetTheme);
  }

  ngOnInit() {
    //   this.isActionDone.emit(false);
    // console.log('iniiittt', this.canReceiveNotifications);
    // if (this.tellerInfo) {
    // }

    this.dialog$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: result => {
        const dialog = result as DialogResponseModel;
        if (dialog) {
          this.dialog = dialog;
          if (this.dialog && this.dialog.response) {
            if (
              this.dialog.response.pin === 'pin submitted' &&
              this.dialog.action === 'do teller action' &&
              this.action
            ) {
              this.doTellerAction();
            }
          }
        }
      },
    });

    // this.theme$.subscribe((theme: string) => {
    //   this.theme = theme;
    // });
  }

  getTellerDetails() {
    // this.tellerInfo = undefined;
  }

  showModal(first_action: string, second_action: string, param: string) {
    switch (param) {
      case 'notification':
        if (this.tellerInfo.can_receive_notifications) {
          this.action = second_action;
          this.actionMessage = `Enter your pin to unset notifications for <b>${this.tellerInfo.client.client_full_name}</b>`;
        } else if (!this.tellerInfo.can_receive_notifications) {
          this.action = first_action;
          this.actionMessage = `Enter your pin to set notifications for <b> ${this.tellerInfo.client.client_full_name}</b>`;
        }
        break;

      case 'tip':
        if (this.tellerInfo.can_receive_tip) {
          this.action = second_action;
          this.actionMessage = `Enter your pin to unset tip for <b>${this.tellerInfo.client.client_full_name}</b>`;
        } else if (!this.tellerInfo.can_receive_tip) {
          this.action = first_action;
          this.actionMessage = `Enter your pin to set tip for <b> ${this.tellerInfo.client.client_full_name}</b>`;
        }
        break;

      case 'active':
        if (this.tellerInfo.is_active) {
          this.action = second_action;
          this.actionMessage = `Enter your pin to deactivate <b>${this.tellerInfo.client.client_full_name}</b>`;
        } else if (!this.tellerInfo.is_active) {
          this.action = first_action;
          this.actionMessage = `Enter your pin to activate <b>${this.tellerInfo.client.client_full_name}</b> `;
        }
        break;

      case 'admin':
        if (this.tellerInfo?.teller_type?.value === 'A') {
          this.action = second_action;
          this.actionMessage = `Enter your pin to revoke admin privileges for ${this.tellerInfo.client.client_full_name}`;
        } else if (this.tellerInfo?.teller_type?.value !== 'A') {
          this.action = first_action;
          this.actionMessage = `Enter your pin to grant admin privileges to <b>${this.tellerInfo.client.client_full_name}</b> `;
        }
        break;

      case 'superadmin':
        if (this.tellerInfo?.teller_type?.value === 'S') {
          this.action = second_action;
          this.actionMessage = `Enter your pin to revoke superadmin privileges for <b>${this.tellerInfo.client.client_full_name}</b>`;
        } else if (this.tellerInfo?.teller_type?.value !== 'S') {
          this.action = first_action;
          this.actionMessage = `Enter your pin to grant superadmin privileges to <b>${this.tellerInfo.client.client_full_name}</b>`;
        }
        break;
    }

    const data = {
      title: 'do teller action',
      type: 'pin',
      message: this.actionMessage,
      action: 'do teller action',
    };
    console.log(data);

    // this.store.dispatch(new OpenActionDialog(data));
  }

  doTellerAction() {
    const response = {
      title: '',
      type: 'loading',
      message: '',
    };
    console.log(response);

    // this.store.dispatch(new OpenDialog(response));

    const body = {
      teller: this.tellerInfo.id,
      action: this.action,
      // pin_code: this.variableService.pin,
    };
    console.log(body);

    //   this.merchantService.doTellerAction(body).subscribe({
    //       next: answer => {
    //         const response = answer as doTellerActionModel;
    //           // this.store.dispatch(new CloseDialog({ response: 'close' }));

    //           if (!response.object.success) {
    //               const data = {
    //                   title: '',
    //                   type: 'failed',
    //                   message: response.object.response_message,
    //               };
    //               console.log(data);

    //               // this.store.dispatch(new OpenDialog(data));
    //           } else {
    //               this.isActionDone.emit(true);

    //               const data = {
    //                   title: '',
    //                   type: 'success',
    //                   message: response.object.response_message,
    //               }; console.log(data);

    //               // this.store.dispatch(new OpenDialog(data));
    //           }
    //       },
    //       error: (error: HttpErrorResponse) => {
    //           this.isActionDone.emit(true);

    //           // this.store.dispatch(new CloseDialog({ response: 'close' }));

    //           if (error.error.response_message) {
    //               const data = {
    //                   title: '',
    //                   type: 'failed',
    //                   message: error.error.response_message,
    //               }; console.log(data);

    //               // this.store.dispatch(new OpenDialog(data));
    //           } else {
    //               const data = {
    //                   title: '',
    //                   type: 'failed',
    //                   message: 'An error occurred while doing action',
    //               }; console.log(data);

    //               // this.store.dispatch(new OpenDialog(data));
    //           }
    //       },
    //   });
  }

  // toggleNotifactionsCheckbox() {
  //     this.canReceiveNotifications = !this.canReceiveNotifications;

  //     console.log('nooott', this.canReceiveNotifications);
  // }

  // toggleIsActiveCheckbox() {
  //     this.isActive = !this.isActive;

  //     console.log('is active ?=', this.isActive);
  // }

  // ngOnDestroy(): void {
  //     this.onDestroy$.next();
  //     this.onDestroy$.complete();
  // }
}
