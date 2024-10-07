import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ConfigService, SettingsService } from '../../../core/services';
import {
  AddResponseModel,
  BodyModel,
  MailModel,
} from '../../settings/settings.models';
import { ContactInfo, PrimaryDataModel } from '../client.model';
import { DialogService } from '../../../core/services';
import { ClientService } from '../../../core/services';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModeModel } from '../../../core/services/config/main-config.models';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-client-contacts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client-contacts.component.html',
  styleUrl: './client-contacts.component.scss',
})
export class ClientContactsComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<void> = new Subject<void>();
  emailsLoading = false;
  phoneNumbersLoading = false;
  loading = false;
  emails: MailModel[] | null = null;
  phoneNumbers: MailModel[] | null = null;
  contactId!: ContactInfo;
  isContactInfoFormShown = false;
  theme$: Observable<ModeModel>;
  theme!: ModeModel;
  pin!: string;
  @Input() id!: number | string;
  @Input() canAddPhoneNumber = false;
  @Input() canAddEmail = false;
  @Input() newPhoneNumber = false;
  @Input() newAccount = false;
  //@Input() eMail: MailModel[] | null = null;
  //@Input() telephoneNumber: MailModel[] | null = null;

  newTelephone = new FormControl('');
  email = new FormControl('', [Validators.required, Validators.email]);
  phoneNumber = new FormControl('', Validators.required);

  dialogState$!: Observable<DialogResponseModel>;
  constructor(
    private settingsService: SettingsService,
    private dialogService: DialogService,
    private clientService: ClientService,
    private configService: ConfigService
  ) {
    this.theme$ = this.configService.getMode();
    this.dialogState$ = this.dialogService.getDialogState();
  }

  ngOnInit(): void {
    this.getEmails();
    this.getPhoneNumbers();

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
    this.phoneNumbers = null;
    this.phoneNumbersLoading = true;
    this.settingsService.getClientContact(this.id, 'phoneNumber').subscribe({
      next: response => {
        this.phoneNumbers = response.objects;
        this.phoneNumbersLoading = false; // Mettre à jour ici
      },
      error: err => {
        console.error(
          'Erreur lors de la récupération des numéros de téléphone:',
          err
        );
        this.phoneNumbersLoading = false;
      },
    });
  }

  addPhoneNumber() {
    this.newPhoneNumber = !this.newPhoneNumber;
  }

  addAccount() {
    this.newAccount = !this.newAccount;
  }

  openPinPopup(contactType: string) {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: contactType,
    });
  }

  makeNumberOrEmailPrimary(
    id: { id: number; is_primary: boolean },
    type: string
  ): void {
    const checkingPrimaryEmail = this.emails?.some(
      (obj: { is_primary: boolean }) => obj.is_primary === true
    );
    const checkingPrimaryNumber = this.phoneNumbers?.some(
      (obj: { is_primary: boolean }) => obj.is_primary === true
    );
    const body: PrimaryDataModel = { is_primary: !id.is_primary };

    if (
      (type === 'email' && checkingPrimaryEmail && !id.is_primary) ||
      (type === 'phoneNumber' && checkingPrimaryNumber && !id.is_primary)
    ) {
      this.dialogService.openToast({
        type: 'failed',
        title: 'Échec',
        message:
          'There is already an email or phone number primary, Please remove the primary on the other email or phone number before making another email or number primary.',
      });
    } else if (
      (type === 'email' && (!checkingPrimaryEmail || id.is_primary)) ||
      (type === 'phoneNumber' && (!checkingPrimaryNumber || id.is_primary))
    ) {
      this.dialogService.dispatchLoading();

      this.clientService
        .makeNumberOrEmailPrimary(id.id, body)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: response => {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'success',
              title: 'Succès',
              message: response.object.response_message ?? 'Success',
            });

            // Mettez à jour directement l'objet dans la liste
            if (type === 'email' && this.emails) {
              this.emails = null;
              this.getEmails();
            } else if (type === 'phoneNumber' && this.phoneNumbers) {
              this.phoneNumbers = null;
              this.getPhoneNumbers();
            }

            // Rafraîchir les données après l'appel API
          },
          error: msg => {
            this.dialogService.closeLoading();
            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message:
                msg?.object?.response_message ?? 'Failed, please try again',
            });
          },
        });
    }
  }

  refreshContact(type: string) {
    if (type === 'email') {
      this.isContactInfoFormShown = false;
      this.emails = null;
      this.getEmails();
    } else if (type === 'phoneNumber') {
      this.isContactInfoFormShown = false;
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
        next: (response: AddResponseModel) => {
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
              this.loading = false;
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
