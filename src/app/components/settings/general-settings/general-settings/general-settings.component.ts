import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { AddResponse, MailModel } from '../../setting.model';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../../core/services';
import { ClientService } from '../../../../core/services/client/client.service';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { BodyModel } from '../../setting.model';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  clientInfo!: UserInfoModel;
  newAccount = false;
  newPhoneNumber = false;
  isLoading!: false;
  id!: number;
  loading = false;
  emailsLoading = true;
  phoneNumbersLoading = true;
  phoneNumbers: MailModel[] | null = null;
  private userInfo$: Observable<UserInfoModel>;
  emails: MailModel[] | null = null;
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]+$'),
  ]);

  dialogState$!: Observable<DialogResponseModel>;

  pin!: string;
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private dialogService: DialogService,
    private clientService: ClientService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
    this.dialogState$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo) {
          this.clientInfo = userinfo;
          this.id = userinfo.client.id;
          console.log('userinfoooooooooooooo', userinfo);
          if (this.id) {
            this.getPhoneNumbers();
            this.getEmails();
          }
        }
      },
    });

    this.dialogState$.pipe(takeUntil(this.onDestroy$)).subscribe({
      next: (dialogResponse: DialogResponseModel) => {
        console.log('PIN reçu:', this.pin);
        if (
          dialogResponse.action === 'phoneNumber' &&
          dialogResponse.response.pin
        ) {
          this.pin = dialogResponse.response.pin;
          this.submitContact(dialogResponse.action);
        } else if (
          dialogResponse.action === 'email' &&
          dialogResponse.response.pin
        ) {
          this.pin = dialogResponse.response.pin;
          this.submitContact(dialogResponse.action);
        }
      },
    });
  }

  getEmails() {
    this.emailsLoading = true;
    this.settingsService.getClientContact(this.id, 'email').subscribe({
      next: response => {
        this.emails = response.objects;
        this.emailsLoading = false;
      },
      error: err => {
        console.error('Erreur lors de la récupération des emails:', err);
        this.emailsLoading = false;
      },
    });
  }

  getPhoneNumbers() {
    this.phoneNumbersLoading = true;
    this.settingsService.getClientContact(this.id, 'phoneNumber').subscribe({
      next: response => {
        this.phoneNumbers = response.objects;
        this.phoneNumbersLoading = false;
      },
      error: err => {
        console.error('Erreur lors de la récupération des emails:', err);
        this.emailsLoading = false;
      },
    });
  }

  addAccount() {
    this.newAccount = !this.newAccount;
  }
  addPhoneNumber() {
    this.newPhoneNumber = !this.newPhoneNumber;
  }

  refreshContact(type: string) {
    if (type === 'email') {
      this.emails = null;
      this.getEmails();
    } else if (type === 'phoneNumber') {
      this.phoneNumbers = null;
      this.getPhoneNumbers();
    }
  }

  submitContact(contactType: string) {
    this.dialogService.dispatchLoading();
    this.loading = true;

    let body: BodyModel = {
      pin_code: '',
      id_type: '',
      ident: '',
    };

    if (contactType === 'email') {
      body = {
        pin_code: this.pin,
        id_type: 'E',
        ident: this.email.value ?? '',
      };
    } else if (contactType === 'phoneNumber') {
      body = {
        pin_code: this.pin,
        id_type: 'P',
        ident: this.phoneNumber.value ?? '',
      };
    }

    this.clientService
      .addAphoneNumber(body)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (response: AddResponse) => {
          this.loading = false;
          this.email.reset();
          this.phoneNumber.reset();
          this.dialogService.closeLoading();
          if (response.object.success) {
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: 'success',
            });
            if (contactType === 'email') {
              this.refreshContact('email');
              this.newAccount = false;
            } else if (contactType === 'phoneNumber') {
              this.refreshContact('phoneNumber');
              this.newPhoneNumber = false;
            }
          } else {
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'failed',
            });
          }
        },
        error: () => {
          this.dialogService.closeLoading();
          this.dialogService.openToast({
            type: 'failed', // Assurez-vous que 'error' est un type valide défini dans toastTypeModel
            title: 'Échec',
            message: 'failed please try again',
          });
          this.email.reset();
          this.phoneNumber.reset();
          this.loading = false;
        },
      });
  }

  openPinPopup(contactType: string) {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: contactType,
    });
  }
}
