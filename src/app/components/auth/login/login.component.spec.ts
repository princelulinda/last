import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { next: '/s/' }, data: {} },
          },
        },
      ],
    }).compileComponents();

    // TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have login form', () => {
  //   const fixture = TestBed.createComponent(LoginComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.loginForm).toEqual(
  //     new FormBuilder().nonNullable.group({
  //       username: ['', Validators.required, Validators.minLength(2)],
  //       password: ['', Validators.required, Validators.minLength(8)],
  //     })
  //   );
  // });
});
