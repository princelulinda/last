import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService, ConfigService } from '../../../core/services';
import { FullpathService } from '../../../core/services';
import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../core/services';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    PasswordFieldComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  dialog$: Observable<DialogResponseModel>;
  loginLoader = false;
  showPassword = false;
  passwordType = 'password';
  loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fullpathService: FullpathService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  redirectToNext() {
    const nextPath = this.route.snapshot.queryParamMap.get('next');
    if (nextPath) {
      this.router.navigate([nextPath]);
    } else {
      this.router.navigate([this.fullpathService.nextDefaultUrl]);
    }
    this.managePlateformByURL(nextPath ?? this.fullpathService.nextDefaultUrl);
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      console.log('LOGIN ALREADY AUTHENTICATED');
      this.redirectToNext();
    } else {
      console.log('LOGIN NOT AUTHENTICATED');
    }
  }

  onLoginSubmit() {
    this.loginLoader = true;
    this.dialogService.dispatchLoading();
    if (this.loginForm.value.username && this.loginForm.value.password) {
      this.authService
        .login({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
        })
        .subscribe({
          next: data => {
            this.loginLoader = false;
            console.log(data);
            // const userData = (data as { user: UserApiResponse }).user;
            this.dialogService.closeLoading();
            this.authService.populateClient(this.router, 'newsFeed');
            // if (userData.token) {
            //   this.redirectToNext();
            // }
          },
          error: () => {
            this.loginLoader = false;
            this.dialogService.closeLoading();

            this.dialogService.openToast({
              type: 'failed',
              title: 'Échec',
              message: 'An error occured!',
            });
          },
        });
    }
  }
  onPasswordChange(pin: string) {
    this.loginForm.get('password')?.setValue(pin);
  }
  changePasswordType() {
    if (!this.showPassword) {
      this.showPassword = true;
      this.passwordType = 'text';
    } else {
      this.showPassword = false;
      this.passwordType = 'password';
    }
  }

  private managePlateformByURL(url: string) {
    const plateformData = environment.plateformsUuid.find(item =>
      item.baseHref.includes(url)
    );

    if (plateformData) {
      this.configService.switchPlateform(plateformData.name);
    } else {
      this.configService.switchPlateform('newsFeed');
    }
  }
  handleEnter() {
    if (this.loginForm.valid) {
      this.onLoginSubmit();
    }
  }
}
