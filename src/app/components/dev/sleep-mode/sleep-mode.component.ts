import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService, DialogService } from '../../../core/services';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInfoModel } from '../../../core/db/models/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sleep-mode',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sleep-mode.component.html',
  styleUrl: './sleep-mode.component.scss',
})
export class SleepModeComponent implements OnInit {
  user!: UserInfoModel | null;
  user$: Observable<UserInfoModel>;

  isLoading = false;
  password = new FormControl('', [Validators.required]);

  constructor(
    private dialogService: DialogService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.getUserInfo();
  }

  ngOnInit() {
    this.user$.subscribe({
      next: user => {
        this.user = user;
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
    const password = this.password.value;
    if (password) {
      this.authService.passwordVerification(password).subscribe({
        next: response => {
          this.isLoading = false;
          this.password.reset();
          const res = response as { object: { success: boolean } };
          if (res.object.success === true) {
            this.unlock();
          }
        },
        error: () => {
          this.isLoading = false;
          this.password.reset();
        },
      });
    }
  }

  private unlock() {
    this.dialogService.unlockScreen();
    this.dialogService.startWatching();
  }
}
