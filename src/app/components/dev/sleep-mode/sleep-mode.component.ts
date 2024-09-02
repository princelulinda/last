import { Component, HostListener, OnInit } from '@angular/core';
import {
  AuthService,
  ConfigService,
  DialogService,
} from '../../../core/services';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserInfoModel } from '../../../core/db/models/auth';
import { Observable } from 'rxjs';
import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';
import { ModeModel } from '../../../core/services/config/main-config.models';

@Component({
  selector: 'app-sleep-mode',
  standalone: true,
  imports: [ReactiveFormsModule, PasswordFieldComponent],
  templateUrl: './sleep-mode.component.html',
  styleUrl: './sleep-mode.component.scss',
})
export class SleepModeComponent implements OnInit {
  user!: UserInfoModel | null;
  user$: Observable<UserInfoModel>;
  activeMode!: ModeModel;
  activeMode$: Observable<ModeModel>;
  form: FormGroup;

  isLoading = false;
  showPassword = false;
  passwordType = 'password';
  // password = new FormControl('', [Validators.required]);

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.user$ = this.authService.getUserInfo();
    this.activeMode$ = this.configService.getMode();

    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.user$.subscribe({
      next: user => {
        this.user = user;
      },
    });
    this.activeMode$.subscribe({
      next: mode => {
        this.activeMode = mode;
      },
    });
  }

  @HostListener('document:keydown', ['$event'])
  animationStart() {
    const element = document.getElementById('toAnimate');
    const showElement = document.getElementsByClassName('hidDiv')[0];

    element?.classList.add('animation');

    // showElement?.classList.remove('show');
    showElement?.classList.add('show');
    // passInput?.focus();
  }

  verification() {
    this.isLoading = true;
    const password = this.form.value.password;
    if (password) {
      this.authService.passwordVerification(password).subscribe({
        next: response => {
          this.isLoading = false;
          this.form.reset();
          const res = response as { object: { success: boolean } };
          if (res.object.success === true) {
            this.unlock();
          }
        },
        error: () => {
          this.isLoading = false;
          this.form.reset();
        },
      });
    }
  }

  setShowPassword() {
    this.showPassword = !this.showPassword;

    if (this.showPassword) {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  private unlock() {
    this.dialogService.unlockScreen();
    this.dialogService.startWatching();
  }
}
