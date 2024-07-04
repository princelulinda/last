import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable, Subject } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { MailModel } from '../../setting.model';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../../core/services';
import { ClientService } from '../../../../core/services/client/client.service';
import { DialogResponseModel } from '../../../../core/services/dialog/dialogs-models';
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

  pin!: number;
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

    // this.dialogService.getDialogState().pipe(takeUntil(this.onDestroy$)).subscribe({
    //   next: (dialogResponse: DialogResponseModel) => {
    //   if (dialogResponse && dialogResponse.response === 'pin submitted') {
    //     this.pin =  dialogResponse.response.pin
    //   if (dialogResponse.action === 'phoneNumber') {
    //   this.submitContact(dialogResponse.action);
    //   } else if (dialogResponse.action === 'email') {
    //   this.submitContact(dialogResponse.action);
    //   }
    //   }
    //   },
    //   });
  }

  getEmails() {
    this.emailsLoading = true;
    this.settingsService.getClientContact(this.id, 'email').subscribe({
      next: response => {
        this.emails = response.objects; // Utilisez la propriété 'objects' comme défini dans le service
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

  // submitContact(contactType: string) {
  //   // Afficher le dialogue de chargement
  //   this.dialogService.dispatchLoading('loading');

  //   this.loading = true;
  //   let body = {};
  //   if (contactType === 'email') {
  //   body = {
  //   pin_code: this.pin,
  //   id_type: 'E',
  //   ident: this.email.value,
  //   };
  //   } else if (contactType === 'phoneNumber') {
  //   body = {
  //   pin_code: this.pin,
  //   id_type: 'P',
  //   ident: this.phoneNumber.value,
  //   };
  //   }

  //   this.clientService
  //   .addAphoneNumber(body)
  //   .pipe(takeUntil(this.onDestroy$))
  //   .subscribe({
  //   next: (response: any) => { // Utilisez 'any' pour éviter les erreurs de type
  //   this.loading = false;
  //   this.email.reset();
  //   this.phoneNumber.reset();
  //   this.dialogService.closeLoading(); // Fermer le dialogue de chargement

  //   // Vérifiez si la réponse contient la propriété 'object'
  //   if (response && response.object && response.object.success) {
  //   // Afficher le toast de succès
  //   this.dialogService.openToast({
  //   type: 'success',
  //   title: '',
  //   message: 'Success',
  //   });

  //   if (contactType === 'email') {
  //   this.refreshContact('email');
  //   this.newAccount = false;
  //   } else if (contactType === 'phoneNumber') {
  //   this.newPhoneNumber = false;
  //   this.refreshContact('phoneNumber');
  //   }
  //   } else {
  //   // Afficher le toast d'échec
  //   this.dialogService.openToast({
  //   type: 'failed',
  //   title: '',
  //   message: response && response.object ? response.object.response_message : 'An error occurred',
  //   });
  //   }
  //   },
  //   error: (msg) => {
  //   this.dialogService.closeLoading(); // Fermer le dialogue de chargement
  //   // Afficher le toast d'échec
  //   this.dialogService.openToast({
  //   type: 'failed',
  //   title: '',
  //   message: 'Failed, please try again',
  //   });
  //   this.email.reset();
  //   this.phoneNumber.reset();
  //   this.loading = false;
  //   },
  //   });
  //   }

  openPinPopup(contactType: string) {
    this.dialogService.openDialog({
      type: 'pin',
      title: 'Enter your PIN code',
      message: 'Please enter your PIN code to continue.',
      action: contactType,
    });
  }
}
