import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '../../../core/services';
import { FullpathService } from '../../../core/services';
import { UserApiResponse } from '../../../core/db/models';
import { PasswordFieldComponent } from '../../../global/password-field/password-field.component';

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
  loginForm = this.formBuilder.nonNullable.group({
    // username: ['', Validators.required, Validators.minLength(2)],
    // password: ['', Validators.required, Validators.minLength(8)],
    number: [''],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fullpathService: FullpathService
  ) {}

  redirectToNext() {
    const nextPath = this.route.snapshot.queryParamMap.get('next');
    console.log(
      `LOGIN : NEXT URL : '${nextPath}'`,
      ' :: ',
      this.route.snapshot.paramMap
    );
    if (nextPath) {
      this.router.navigate([nextPath]);
    } else {
      this.router.navigate([this.fullpathService.nextDefaultUrl]);
    }
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
    if (this.loginForm.value.username && this.loginForm.value.password) {
      this.authService
        .login({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
        })
        .subscribe(data => {
          console.log('GOT LOGIN : ', data);
          const userData = (data as { user: UserApiResponse }).user;
          console.log('GOT LOGIN 2 : ', userData);
          if (userData.token) {
            console.log('GOT LOGIN 3 : ', userData);
            this.redirectToNext();
          }
        });
    }
  }
}
