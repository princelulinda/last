import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services';
import { DialogService } from '../../../core/services';
import { takeUntil, Subject } from 'rxjs';
import {
  EmailVerificationResponse,
  phoneNumberVerificaitonResponse,
  createAccountResponse,
  bankListResponse,
} from '../auth.model';
import { FileComponent } from '../../../global/components/file/file.component';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    PasswordFieldComponent,
    ReactiveFormsModule,
    FileComponent,
  ],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent implements OnInit {
  private onDestroy$: Subject<void> = new Subject<void>();
  step = 0;
  submitted = false;
  isLoadingCreation!: boolean;
  firstName!: string;
  lastName!: string;
  Email!: string;
  Profile!: string;
  EmailVerificationloader = false;
  phoneNumberVerificationLoader = false;
  isLoadingBank = false;
  // file: bankListResponse[] | [] | null = null;
  getBanksList: bankListResponse[] | [] | null = null;
  emailToVerify!: EmailVerificationResponse;
  phoneNumberToVerify!: phoneNumberVerificaitonResponse;
  showPassword = false;
  passwordType = 'password';
  arePasswordsMatch = false;
  isMatchNumber!: boolean;
  isMatchEmail!: boolean;
  isMatchConfirmPassword!: boolean;
  isNotMatchPassword!: boolean;
  inputNumber!: string;
  inputconfirmPassword!: string;
  inputEmail!: string;
  inputPassword!: string;
  bankId!: number;
  selectedBankIndex: number | null = null;
  i!: number;

  ngOnInit(): void {
    this.dialogService
      .getDialogState()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (dialogResponse: DialogResponseModel) => {
          if (
            dialogResponse.action === 'confirm' &&
            dialogResponse.response.confirmation === 'YES'
          ) {
            this.createAccount();
            console.log(dialogResponse);
          } else {
            this.selectedBankIndex = null;
          }
        },
      });
  }

  submit() {
    this.submitted = true;
    if (this.step === 5) {
      this.createAccount();
    }
    this.step = this.step + 1;
  }

  previous() {
    this.step = this.step - 1;
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogService: DialogService
  ) {}

  multiStepForm = this.fb.group({
    authentificationInformation: this.fb.group({
      picture: ['', Validators.required],
      number: [''],
      username: ['', Validators.required],
      email: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }),

    personalInformation: this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      gender: ['', Validators.required],
      martialStatus: ['', Validators.required],
      birthday: ['', Validators.required],
      // birthPlace: ['', Validators.required],
    }),

    cardInformation: this.fb.group({
      cardIdNumber: ['', Validators.required],
      deliveryPlace: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      cardType: ['', Validators.required],
      expiryDate: [''],
    }),
  });
  userInfo!: createAccountResponse;
  createAccount() {
    this.isLoadingCreation = true;
    const data = {
      // creation_client: this.id,
      organization: this.bankId,
      picture:
        this.multiStepForm.controls.authentificationInformation.value.picture,
      email:
        this.multiStepForm.controls.authentificationInformation.value.email,
      username:
        this.multiStepForm.controls.authentificationInformation.value.username,
      password:
        this.multiStepForm.controls.authentificationInformation.value.password,
      password2:
        this.multiStepForm.controls.authentificationInformation.value
          .confirmPassword,
      firstname: this.multiStepForm.controls.personalInformation.value.fname,
      lastname: this.multiStepForm.controls.personalInformation.value.lname,
      birthday: this.multiStepForm.controls.personalInformation.value.birthday,
      // birth_place:
      //     this.multistep.controls.personalInformation.value.birthPlace,
      sex: this.multiStepForm.controls.personalInformation.value.gender,
      marital_status:
        this.multiStepForm.controls.personalInformation.value.martialStatus,
      telephones:
        this.multiStepForm.controls.authentificationInformation.value.number,
      card_id: {
        card_id_type:
          this.multiStepForm.controls.cardInformation.value.cardType,
        other_card_type: '',
        reference_number:
          this.multiStepForm.controls.cardInformation.value.cardIdNumber,
        place_of_issue:
          this.multiStepForm.controls.cardInformation.value.deliveryPlace,
        date_of_issue:
          this.multiStepForm.controls.cardInformation.value.deliveryDate,
        expiry_date:
          this.multiStepForm.controls.cardInformation.value.expiryDate,
      },
      card_id_picture_recto: '',
      card_id_picture_verso: '',
      father_name: '',
      mother_name: '',
    };
    // if (this.multiStepForm.controls.cardInformation.value.expiryDate !== '') {
    //     data.card_id['expiry_date'] = this.multiStepForm.controls.cardInformation.value.expiryDate;
    // }
    this.authService.createAccount(data).subscribe({
      next: response => {
        this.isLoadingCreation = false;
        this.userInfo = response;
        this.step = this.step = 5;
      },
      error: () => {
        this.isLoadingCreation = false;
      },
    });
  }

  getClientInfo() {
    this.firstName =
      this.multiStepForm.controls.personalInformation?.value?.fname || '';
    this.lastName =
      this.multiStepForm.controls.personalInformation?.value?.lname || '';
    this.Email =
      this.multiStepForm.controls.authentificationInformation?.value?.email ||
      '';
    this.Profile =
      this.multiStepForm.controls.authentificationInformation?.value?.picture ||
      '';
  }

  EmailVerification() {
    this.EmailVerificationloader = true;
    const email =
      this.multiStepForm.controls.authentificationInformation?.value?.email ||
      '';
    this.authService.verifyEmail(email).subscribe({
      next: (response: EmailVerificationResponse) => {
        this.EmailVerificationloader = false;
        this.emailToVerify = response;
        console.log('Données sélectionnées', this.emailToVerify);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération de email:', error),
    });
  }

  phoneNumverVerification() {
    this.phoneNumberVerificationLoader = true;
    const tel =
      this.multiStepForm.controls.authentificationInformation?.value?.number ||
      '';
    this.authService.verifyPhoneNumber(tel).subscribe({
      next: (response: phoneNumberVerificaitonResponse) => {
        this.phoneNumberVerificationLoader = false;
        this.phoneNumberToVerify = response;
        console.log('Données sélectionnées', this.phoneNumberToVerify);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération de email:', error),
    });
  }
  getBankList() {
    this.authService.getBanksList().subscribe({
      next: (response: { objects: bankListResponse[] }) => {
        this.getBanksList = response.objects;
        console.log('Données sélectionnées', this.getBanksList);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des tontines:', error),
    });
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
  checkPasswordSimilarity() {
    if (
      this.multiStepForm.controls.authentificationInformation.value.password !==
      this.multiStepForm.controls.authentificationInformation.value
        .confirmPassword
    ) {
      this.arePasswordsMatch = false;
    } else {
      this.arePasswordsMatch = true;
    }
  }
  checkNumber() {
    const pattern = /[0-9]+/;
    this.isMatchNumber = !pattern.test(this.inputNumber);
  }
  checkEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isMatchEmail = !emailPattern.test(this.inputEmail);
  }
  isAllInputValueUndefined(): boolean {
    return this.inputEmail === undefined && this.inputNumber === undefined;
  }
  selectedBankId(bank: { organization_id: number }) {
    this.bankId = bank.organization_id;
    console.log(this.bankId);
  }
  onPasswordChange(password: string) {
    this.multiStepForm.controls.authentificationInformation.patchValue({
      password,
    });
  }

  onPictureChange(picture: string) {
    this.multiStepForm.controls.authentificationInformation.patchValue({
      picture,
    });
  }

  // openPinPopup(bankId: string) {
  //   this.dialogService.openDialog({
  //     type: 'confirm',
  //     title: '',
  //     message: 'Do you want to create an account in this organization ?',
  //     action:'confirm',
  //   });
  // }
}
