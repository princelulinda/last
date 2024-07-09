import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { MailModel } from '../../setting.model';
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
  emails: MailModel[] | null = null; // Utilisez le type MailModel pour vos emails
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', Validators.required);
  dialogState$!: Observable<DialogResponseModel>;

  pin!: string;
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private dialogService: DialogService,
    private clientService: ClientService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
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
    this.dialogService
      .getDialogState()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (dialogResponse: DialogResponseModel) => {
          this.pin = dialogResponse.response.pin;

          console.log('Received PIN:', this.pin);

          if (dialogResponse.action === 'phoneNumber') {
            this.submitContact(dialogResponse.action);
          } else if (dialogResponse.action === 'email') {
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
    this.dialogService.dispatchLoading('loading');
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
        // next: () => {
        // },
        // error: () => {
        // },
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
