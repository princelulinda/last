import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  fromEvent,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { AuthService, ConfigService } from '../../core/services';
import { UserInfoModel } from '../../core/db/models/auth';
import { ProfileCardComponent } from '../../global/components/custom-field/profile-card/profile-card.component';
import {
  ModeModel,
  ScreenStateModel,
} from '../../core/services/config/main-config.models';

@Component({
  selector: 'app-sleep-mode',
  standalone: true,
  imports: [ReactiveFormsModule, ProfileCardComponent],
  templateUrl: './sleep-mode.component.html',
  styleUrl: './sleep-mode.component.scss',
})
export class SleepModeComponent implements OnInit, AfterViewInit {
  user!: UserInfoModel;
  user$: Observable<UserInfoModel>;

  activeMode!: ModeModel;
  activeMode$: Observable<ModeModel>;

  screenState$: Observable<ScreenStateModel>;

  form: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
  });

  isLoading = false;
  showPassword = false;
  passwordType = 'password';

  screenLockedElement: HTMLElement | null = null;

  private readonly screenLockTimeout: number = 15 * 60 * 1000; // 15 minutes
  private screenLockEvent$: Observable<boolean>;
  private resetScreenLockEvent$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private fb: FormBuilder
  ) {
    this.user$ = this.authService.getUserInfo();
    this.activeMode$ = this.configService.getMode();
    this.screenState$ = this.configService.getScreenState();

    this.screenLockEvent$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'keypress')
    ).pipe(
      tap(() => this.resetScreenLockEvent$.next()), // reset on any event
      switchMap(() => timer(this.screenLockTimeout).pipe(map(() => true)))
    );
  }

  ngOnInit() {
    this.user$.subscribe({
      next: user => {
        if (user) {
          this.user = user;
          this.startWatching();
        }
      },
    });
    this.activeMode$.subscribe({
      next: mode => {
        this.activeMode = mode;
      },
    });

    this.screenState$.subscribe({
      next: isLocked => {
        if (isLocked === 'locked') {
          this.screenLockedElement?.classList.remove('stop');
          this.screenLockedElement?.classList.add('stand');
        } else {
          this.screenLockedElement?.classList.remove('stand');
          this.screenLockedElement?.classList.add('stop');
        }
      },
    });
  }

  @HostListener('document:keydown', ['$event'])
  animationStart() {
    const element = document.getElementById('toAnimate');
    const showElement = document.getElementsByClassName('hidDiv')[0];

    element?.classList.add('animation');
    showElement?.classList.add('show');
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
            this.configService.switchScreenState('unlocked');
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

  startWatching() {
    this.screenLockEvent$.subscribe({
      next: () => {
        this.configService.switchScreenState('locked');
      },
    });
  }
  ngAfterViewInit() {
    this.screenLockedElement = document.getElementById('standby');
  }
}
