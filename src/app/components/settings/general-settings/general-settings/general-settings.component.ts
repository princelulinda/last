import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services';
import { Observable, Subject } from 'rxjs';
import { UserInfoModel } from '../../../../core/db/models/auth';
import { SettingsService } from '../../../../core/services/settings/settings.service';
import { MailModel } from '../../setting.model';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
  constructor(
    private authService: AuthService,
    private settingsService: SettingsService
  ) {
    this.userInfo$ = this.authService.getUserInfo();
  }

  ngOnInit(): void {
    this.userInfo$.subscribe({
      next: userinfo => {
        if (userinfo) {
          this.clientInfo = userinfo;
          this.id = userinfo.client.id;
          console.log('userinfo', this.clientInfo);
          if (this.id) {
            this.getPhoneNumbers();
            this.getEmails();
          }
        }
      },
    });
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
}
