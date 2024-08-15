import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, ConfigService } from '../../../../core/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { AddResponse, MailModel } from '../../settings.models';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../../core/services';
import { ClientService } from '../../../../core/services/client/client.service';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
import { BodyModel } from '../../settings.models';
import { ClipboardDirective } from '../../../dev/clipboard.directive';
import { GlobalMappingComponent } from '../../../dev/global-mapping/global-mapping.component';
import { ModeModel } from '../../../../core/services/config/main-config.models';
import { CommonModule } from '@angular/common';

// { RouterLink } from '@angular/router';
@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ClipboardDirective,
    GlobalMappingComponent,
    CommonModule,
  ],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  clientInfo!: UserInfoModel;
  newAccount = false;
  newPhoneNumber = false;
  isLoading!: false;
  selectedsubmenu = '';
  id!: number;
  loading = false;
  emailsLoading = true;
  selectedNumberToMap!: string;
  phoneNumbersLoading = true;
  phoneNumbers: MailModel[] | null = null;
  showActionPopupAt!: string;
  private userInfo$: Observable<UserInfoModel>;
  //showActionPopupAt:any
  //selectedNumberToMap!: string;
  emails: MailModel[] | null = null;
  email = new FormControl('', [Validators.required, Validators.email]);
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
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
    private clientService: ClientService,

    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
    this.userInfo$ = this.authService.getUserInfo();
    this.dialogState$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.theme$.subscribe({
      next: theme => {
        this.theme = theme;
        //console.log('themmeee', this.theme);
      },
    });

    this.settingsService.selectedSubMenu$.subscribe(selected => {
      this.selectedsubmenu = selected;
    });
    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo) {
          this.clientInfo = userinfo;
          this.id = userinfo.client.id;
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
  toggleActionPopup(number: MailModel) {
    // this.showActionPopupAt = number.ident;
    if (this.showActionPopupAt && this.showActionPopupAt === number.ident) {
      this.showActionPopupAt = '';
    } else {
      this.showActionPopupAt = number.ident;
      // console.log('hello',this.showActionPopupAt)
    }
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
  onThemeSwitchChange() {
    this.configService.switchMode();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
