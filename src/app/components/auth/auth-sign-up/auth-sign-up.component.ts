import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

import { Subject, Observable } from 'rxjs';

import { PasswordFieldComponent } from '../../../global/components/custom-field/password-field/password-field.component';

import { AuthService } from '../../../core/services';
import { DialogService } from '../../../core/services';
import { SkeletonComponent } from '../../../global/components/loaders/skeleton/skeleton.component';

import {
  EmailVerificationResponseModel,
  PhoneNumberVerificaitonResponseModel,
  CreateAccountResponseModel,
  BankListResponseModel,
  CardIdDataModel,
} from '../auth.model';
import { FileComponent } from '../../../global/components/file/file.component';
import { DialogResponseModel } from '../../../core/services/dialog/dialogs-models';
import { UploadedFileModel } from '../auth.model';
import { BankService } from '../../../core/services/bank/bank.service';
import { DbService } from '../../../core/db/db.service';
import { LookupComponent } from '../../../global/components/lookups/lookup/lookup.component';
import { LookupModel } from '../../../global/models/global.models';

@Component({
  selector: 'app-auth-sign-up',
  standalone: true,
  imports: [
    RouterLink,
    PasswordFieldComponent,
    ReactiveFormsModule,
    FileComponent,
    SkeletonComponent,
    LookupComponent,
  ],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.scss',
})
export class AuthSignUpComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject<void>();
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
  getBanksList: BankListResponseModel[] | [] | null = null;
  emailToVerify!: EmailVerificationResponseModel;
  phoneNumberToVerify!: PhoneNumberVerificaitonResponseModel;
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
  bankId: number | null = null;
  selectedBankIndex: number | null = null;
  i!: number;
  dialog$: Observable<DialogResponseModel>;
  uuid!: string;
  docFile!: string;
  id!: number;
  activeLink = '';

  birthday = FormGroup;
  errorMessage!: string;
  errorMessagee!: string;
  isUnder16 = false;
  isUnderDerivaryDate = false;

  // event!: referenceNumberModel[];

  ngOnInit(): void {
    this.dialog$.subscribe({
      next: (status: DialogResponseModel) => {
        if (
          status.action === 'confirmation' &&
          status.response.confirmation === 'YES'
        ) {
          this.createAccount();
        } else {
          this.selectedBankIndex = null;
          this.bankId = null;
        }
      },
    });

    this.route.queryParams.subscribe(params => {
      const reference = params['reference'] || '';
      this.activeLink = `${reference}`;
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
    private bankService: BankService,
    private dialogService: DialogService,
    private dbService: DbService,

    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialog$ = this.dialogService.getDialogState();
  }

  multiStepForm = this.fb.group({
    authentificationInformation: this.fb.group({
      write_picture: ['', Validators.required],
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
  userInfo!: CreateAccountResponseModel;
  createAccount() {
    this.isLoadingCreation = true;
    const data = {
      creation_client: this.id,
      organization: this.bankId,
      picture: '',
      write_picture:
        this.multiStepForm.controls.authentificationInformation.value
          .write_picture,
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
      },
      card_id_picture_recto: '',
      card_id_picture_verso: '',
      father_name: '',
      mother_name: '',
    };
    if (this.multiStepForm.controls.cardInformation.value.expiryDate !== '') {
      (data.card_id as unknown as CardIdDataModel).expiry_date =
        this.multiStepForm.controls.cardInformation.value.expiryDate;
    }
    this.dialogService.dispatchLoading();
    this.authService.createAccount(data).subscribe({
      next: (response: CreateAccountResponseModel) => {
        this.isLoadingCreation = false;
        this.userInfo = response;
        const userData = {
          // username: response.object.user.username,
          // email: response.object.user.email,
          token: response.object.user.token,
          clientId: response.object.client.client_id,
        };
        this.dbService.setLocalStorageUserToken(userData.token);
        this.step = this.step = 5;
        this.dialogService.closeLoading();
      },
      error: error => {
        this.isLoadingCreation = false;
        this.dialogService.closeLoading();
        this.dialogService.openToast({
          type: 'failed',
          title: 'Échec',
          message:
            error?.object?.response_message ??
            $localize`Something went wrong please retry again !`,
        });
      },
    });
  }

  getClientInfo() {
    this.firstName =
      this.multiStepForm.controls.personalInformation.value.fname || '';
    this.lastName =
      this.multiStepForm.controls.personalInformation.value.lname || '';
    this.Email =
      this.multiStepForm.controls.authentificationInformation.value.email || '';
    this.Profile =
      this.multiStepForm.controls.authentificationInformation.value
        .write_picture || '';
  }

  EmailVerification() {
    this.EmailVerificationloader = true;
    const email =
      this.multiStepForm.controls.authentificationInformation?.value?.email ||
      '';
    this.authService.verifyEmail(email).subscribe({
      next: (response: EmailVerificationResponseModel) => {
        this.EmailVerificationloader = false;
        this.emailToVerify = response;
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
      next: (response: PhoneNumberVerificaitonResponseModel) => {
        this.phoneNumberVerificationLoader = false;
        this.phoneNumberToVerify = response;
        console.log('Données sélectionnées', this.phoneNumberToVerify);
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération de email:', error),
    });
  }
  getBankList() {
    this.isLoadingBank = true;
    this.bankService.getAllBanks().subscribe({
      next: (response: { objects: BankListResponseModel[] }) => {
        this.getBanksList = response.objects;
        this.isLoadingBank = false;
      },
      error: (error: Error) =>
        console.error('Erreur lors de la récupération des banks:', error),
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
    // console.log(this.bankId);
  }
  onPasswordChange(password: string) {
    this.multiStepForm.controls.authentificationInformation.patchValue({
      password,
    });
  }

  onPictureChange(write_picture: UploadedFileModel[]) {
    this.uuid = write_picture[0]?.object.uuid;
    this.docFile = write_picture[0]?.object.docfile;
    this.multiStepForm.controls.authentificationInformation.patchValue({
      write_picture: this.uuid,
    });
  }

  openPinPopup() {
    this.dialogService.openDialog({
      action: 'confirmation',
      message: 'Do you want to create an account in this organization ?',
      title: '',
      type: 'confirm',
    });
  }
  selectClient(event: LookupModel | null) {
    if (event) {
      this.id = event.id;
    }
  }
  logout() {
    this.authService.logout();
  }
  isEmailUndefined() {
    return this.inputEmail === undefined;
  }

  isPhoneNumberUndefinedd() {
    return this.inputNumber === undefined;
  }

  validateAge() {
    const today = new Date();
    const birthDateControl = this.multiStepForm.get(
      'personalInformation.birthday'
    );

    const DerivaryDateCotrol = this.multiStepForm.get(
      'cardInformation.deliveryDate'
    );
    const ExpiryDateControl = this.multiStepForm.get(
      'cardInformation.expiryDate'
    );
    if (
      DerivaryDateCotrol &&
      ExpiryDateControl &&
      DerivaryDateCotrol.value &&
      ExpiryDateControl.value
    ) {
      if (DerivaryDateCotrol.value >= ExpiryDateControl.value) {
        this.errorMessagee =
          'The expiration date must be greater than the delivery date';
        this.isUnderDerivaryDate = true;
      } else {
        this.errorMessagee = '';
        this.isUnderDerivaryDate = false;
      }
    }
    if (birthDateControl && birthDateControl.value) {
      const birthDate = new Date(birthDateControl.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16) {
        this.errorMessage = 'You must be at least 16 years old.';
        this.isUnder16 = true;
      } else {
        this.errorMessage = '';
        this.isUnder16 = false;
      }
    }
  }
}
